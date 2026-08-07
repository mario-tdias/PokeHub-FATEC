(() => {
    const URL_API = "https://api.pokemontcg.io/v2/cards";

    const campoEntrada = document.getElementById("tcgInput");
    const botaoBuscar = document.getElementById("tcgSearchBtn");

    const elementoStatus = document.getElementById("tcgStatus");
    const elementoResultados = document.getElementById("tcgResults");
    const rotuloResultados = document.getElementById("resultsLabel");
    const faixaCartas = document.getElementById("tcgStrip");
    const palcoCarta = document.getElementById("tcgStage");
    const elementoVazio = document.getElementById("tcgEmpty");

    const elementoHolo = document.getElementById("tcgHolo");
    const imagemCarta = document.getElementById("tcgCardImg");

    const infoColecao = document.getElementById("infoSet");
    const infoNome = document.getElementById("infoName");
    const infoTipos = document.getElementById("infoTags");
    const infoHp = document.getElementById("infoHp");
    const infoRaridade = document.getElementById("infoRarity");
    const infoNumero = document.getElementById("infoNumber");
    const infoArtista = document.getElementById("infoArtist");
    const infoPreco = document.getElementById("infoPrice");
    const valorPreco = document.getElementById("infoPriceValue");
    const linkPreco = document.getElementById("infoLink");

    const prefereMovimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let cartasAtuais = [];

    function definirStatus(mensagem, tipo) {
        if (!mensagem) {
            elementoStatus.hidden = true;
            elementoStatus.textContent = "";
            elementoStatus.className = "tcg-status";
            return;
        }

        elementoStatus.hidden = false;
        elementoStatus.textContent = mensagem;
        elementoStatus.className = `tcg-status is-${tipo}`;
    }

    function classeTipo(tipo) {
        const chave = (tipo || "").toLowerCase();
        const mapa = {
            fire: "type-fire",
            water: "type-water",
            lightning: "type-electric",
            grass: "type-grass",
            fighting: "type-fighting",
            psychic: "type-psychic",
            darkness: "type-darkness",
            metal: "type-metal",
            dragon: "type-dragon",
            fairy: "type-fairy",
            colorless: "type-colorless",
        };

        return mapa[chave] || "type-colorless";
    }

    function formatarPreco(carta) {
        const precosTcg = carta.tcgplayer && carta.tcgplayer.prices;

        if (precosTcg) {
            const variante = Object.values(precosTcg).find((v) => v && v.market != null);

            if (variante) {
                return {
                    valor: `US$ ${variante.market.toFixed(2)}`,
                    url: carta.tcgplayer.url,
                };
            }
        }

        const cardmarket = carta.cardmarket && carta.cardmarket.prices;

        if (cardmarket && cardmarket.averageSellPrice != null) {
            return {
                valor: `€ ${cardmarket.averageSellPrice.toFixed(2)}`,
                url: carta.cardmarket.url,
            };
        }

        return null;
    }

    function renderizarFaixa(cartas) {
        faixaCartas.innerHTML = "";

        cartas.forEach((carta, indice) => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "tcg-thumb" + (indice === 0 ? " is-active" : "");
            botao.setAttribute("aria-label", `${carta.name} — ${carta.set?.name || ""}`);
            botao.innerHTML = `<img src="${carta.images.small}" alt="" loading="lazy">`;

            botao.addEventListener("click", () => {
                faixaCartas
                    .querySelectorAll(".tcg-thumb")
                    .forEach((miniatura) => miniatura.classList.remove("is-active"));

                botao.classList.add("is-active");
                mostrarCarta(carta);
            });

            faixaCartas.appendChild(botao);
        });
    }

    const dicionarioColecoes = {
        "Ascended Heroes": "Heróis Excelsos",
        "Base Set": "Coleção Base",
        "Paldea Evolved": "Evoluções em Paldea",
        "Obsidian Flames": "Chamas Obsidianas",
        "151": "151",
        "Paradox Rift": "Fenda Paradoxal",
        "Temporal Forces": "Forças Temporais",
        "Twilight Masquerade": "Máscaras do Crepúsculo",
        "Stellar Crown": "Corona Estelar",
        "Surging Sparks": "Faíscas Galpantes",
        "Prismatic Evolutions": "Evoluções Prismáticas",
        "Phantasmal Flames": "Fogo Fantasmagórico",
    };

    const dicionarioTipos = {
        Fire: "Fogo",
        Water: "Água",
        Lightning: "Elétrico",
        Grass: "Planta",
        Fighting: "Luta",
        Psychic: "Psíquico",
        Darkness: "Escuridão",
        Metal: "Metal",
        Dragon: "Dragão",
        Fairy: "Fada",
        Colorless: "Incolor",
        Trainer: "Treinador",
        Energy: "Energia"
    };

    function traduzirTipo(tipoOriginal) {
        if (!tipoOriginal) return "Incolor";
        return dicionarioTipos[tipoOriginal] || tipoOriginal;
    }

    function traduzirColecao(nomeOriginal) {
        if (!nomeOriginal) return "—";
        return dicionarioColecoes[nomeOriginal] || nomeOriginal;
    }

    function mostrarCarta(carta) {
        palcoCarta.hidden = false;
        elementoVazio.hidden = true;

        imagemCarta.src = carta.images.large || carta.images.small;
        imagemCarta.alt = `Carta de ${carta.name}`;


        infoColecao.textContent = carta.set ? traduzirColecao(carta.set.name) : "—";
        infoNome.textContent = carta.name;



        infoTipos.innerHTML = "";
        (carta.types || ["Colorless"]).forEach((tipo) => {
            const etiqueta = document.createElement("span");
            etiqueta.className = `type-badge ${classeTipo(tipo)}`;
            etiqueta.textContent = traduzirTipo(tipo);
            infoTipos.appendChild(etiqueta);
        });

        if (carta.supertype && carta.supertype !== "Pokémon") {
            const etiqueta = document.createElement("span");
            etiqueta.className = "type-badge type-colorless";
            etiqueta.textContent = traduzirTipo(carta.supertype);
            infoTipos.appendChild(etiqueta);
        }
        infoHp.textContent = carta.hp || "—";
        infoRaridade.textContent = carta.rarity || "—";
        infoNumero.textContent = carta.number
            ? `${carta.number}${carta.set?.printedTotal ? " / " + carta.set.printedTotal : ""}`
            : "—";
        infoArtista.textContent = carta.artist || "—";

        const preco = formatarPreco(carta);

        if (preco) {
            infoPreco.hidden = false;
            valorPreco.textContent = preco.valor;
        } else {
            infoPreco.hidden = true;
        }

        if (preco && preco.url) {
            linkPreco.hidden = false;
            linkPreco.href = preco.url;
        } else {
            linkPreco.hidden = true;
        }

        elementoHolo.classList.remove("is-active");
        void elementoHolo.offsetWidth;
        elementoHolo.classList.add("is-active");
    }

    function montarUrlBusca(consulta, usarCuringa) {
        const temEspaco = /\s/.test(consulta);
        let termoLucene;

        if (usarCuringa && !temEspaco) {
            termoLucene = `name:${consulta}*`;
        } else if (temEspaco) {
            termoLucene = `name:"${consulta}"`;
        } else {
            termoLucene = `name:${consulta}`;
        }

        return `${URL_API}?q=${encodeURIComponent(
            termoLucene
        )}&pageSize=20&orderBy=-set.releaseDate`;
    }

    async function buscarCartasApi(consulta, usarCuringa) {
        const resposta = await fetch(montarUrlBusca(consulta, usarCuringa));

        if (!resposta.ok) {
            let detalhe = "";

            try {
                const corpoErro = await resposta.json();
                detalhe = corpoErro?.error?.message || "";
            } catch (_) { }

            throw new Error(
                detalhe || `Erro na API (status ${resposta.status})`
            );
        }

        return resposta.json();
    }

    async function buscarCartas(nome) {
        const consulta = nome.trim();
        if (!consulta) return;

        definirStatus("Buscando cartas…", "loading");
        elementoResultados.hidden = true;
        palcoCarta.hidden = true;
        elementoVazio.hidden = true;

        try {
            let dados;

            try {
                dados = await buscarCartasApi(consulta, true);
            } catch (erroCuringa) {
                console.warn("Busca com wildcard falhou, tentando exata:", erroCuringa);
                dados = await buscarCartasApi(consulta, false);
            }

            cartasAtuais = dados.data || [];

            if (cartasAtuais.length === 0) {
                definirStatus(`Nenhuma carta encontrada para "${consulta}".`, "error");
                elementoVazio.hidden = false;
                return;
            }

            definirStatus(null);
            elementoResultados.hidden = false;
            rotuloResultados.textContent = `${cartasAtuais.length} carta(s) encontrada(s)`;
            renderizarFaixa(cartasAtuais);
            mostrarCarta(cartasAtuais[0]);
        } catch (erro) {
            console.error(erro);
            definirStatus(
                `Não foi possível buscar as cartas agora (${erro.message}). Tente novamente em instantes.`,
                "error"
            );
            elementoVazio.hidden = false;
        }
    }

    if (!prefereMovimentoReduzido) {
        elementoHolo.addEventListener("pointermove", (evento) => {
            const retangulo = elementoHolo.getBoundingClientRect();
            const x = (evento.clientX - retangulo.left) / retangulo.width;
            const y = (evento.clientY - retangulo.top) / retangulo.height;

            const rotacaoY = (x - 0.5) * 18;
            const rotacaoX = (0.5 - y) * 18;

            elementoHolo.style.transform = `rotateX(${rotacaoX}deg) rotateY(${rotacaoY}deg)`;
            elementoHolo.style.setProperty("--mx", `${x * 100}%`);
            elementoHolo.style.setProperty("--my", `${y * 100}%`);
        });

        elementoHolo.addEventListener("pointerleave", () => {
            elementoHolo.style.transform = "rotateX(0deg) rotateY(0deg)";
            elementoHolo.style.setProperty("--mx", "50%");
            elementoHolo.style.setProperty("--my", "50%");
        });
    }

    botaoBuscar.addEventListener("click", () => buscarCartas(campoEntrada.value));

    campoEntrada.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            buscarCartas(campoEntrada.value);
        }
    });
})();