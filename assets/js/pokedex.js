const campoPokemon = document.getElementById("pokeInput");
const botaoBuscar = document.getElementById("searchBtn");
const tela = document.getElementById("screen");
const lente = document.getElementById("lens");


function alterarLente(estado) {
    lente.className = "lens state-" + estado;
}


function mostrarTelaInicial() {
    tela.innerHTML = `
        <div class="screen-label">Nº scanner</div>
        <div class="placeholder">
            <span class="big">◌</span>
            Digite o nome de um pokémon<br>e pressione buscar
        </div>
    `;
}


function mostrarCarregando() {
    tela.innerHTML = `
        <div class="screen-label">Nº scanner</div>
        <div class="placeholder">
            <span class="big">◐</span>
            Buscando...
        </div>
    `;
}


function mostrarErro(nomePokemon) {
    tela.innerHTML = `
        <div class="screen-label">Nº scanner</div>
        <div class="error-msg">
            <span class="big">✕</span>
            Pokémon "${nomePokemon}" não encontrado.<br>
            Confira o nome e tente novamente.
        </div>
    `;
}


const TIPOS_PT = {
    normal: "normal",
    fire: "fogo",
    water: "água",
    electric: "elétrico",
    grass: "planta",
    ice: "gelo",
    fighting: "lutador",
    poison: "veneno",
    ground: "terra",
    flying: "voador",
    psychic: "psíquico",
    bug: "inseto",
    rock: "pedra",
    ghost: "fantasma",
    dragon: "dragão",
    dark: "sombrio",
    steel: "aço",
    fairy: "fada"
};


const HABILIDADES_PT = {
    overgrow: "Crescimento Excessivo",
    blaze: "Chama",
    torrent: "Torrente",
    static: "Estático",
    pressure: "Pressão",
    synchronize: "Sincronismo",
    intimidate: "Intimidação",
    levitate: "Levitação",
    sturdy: "Robustez",
    adaptability: "Adaptabilidade"
};


function mostrarPokemon(pokemon) {


    const numero = String(pokemon.id).padStart(3, "0");


    const imagemPokemon =
        pokemon.sprites.other?.showdown?.front_default ||
        pokemon.sprites.other?.official_artwork?.front_default ||
        pokemon.sprites.front_default;


    const tipos = pokemon.types
        .map(tipo =>
            `<span class="type-pill">${TIPOS_PT[tipo.type.name] || tipo.type.name}</span>`
        )
        .join("");


    const altura = (pokemon.height / 10).toFixed(1);


    const peso = (pokemon.weight / 10).toFixed(1);


    const habilidade =
        HABILIDADES_PT[pokemon.abilities[0].ability.name] ||
        pokemon.abilities[0].ability.name;


    tela.innerHTML = `
        <div class="screen-label">Nº scanner</div>


        <div class="sprite-wrap">
            <img src="${imagemPokemon}" alt="${pokemon.name}">
        </div>


        <div class="poke-number">
            Nº ${numero}
        </div>


        <div class="poke-name">
            ${pokemon.name}
        </div>


        <div class="poke-types">
            ${tipos}
        </div>


        <div class="poke-info">


            <div>
                <strong>Altura</strong><br>
                ${altura} m
            </div>


            <div>
                <strong>Peso</strong><br>
                ${peso} kg
            </div>


            <div>
                <strong>Habilidade</strong><br>
                ${habilidade}
            </div>


        </div>
    `;
}


async function buscarPokemon() {


    const pesquisa = campoPokemon.value.trim().toLowerCase();


    if (!pesquisa) {
        mostrarTelaInicial();
        alterarLente("idle");
        return;
    }


    alterarLente("loading");
    mostrarCarregando();


    try {


        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pesquisa)}`
        );


        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado");
        }


        const pokemon = await resposta.json();


        mostrarPokemon(pokemon);


        alterarLente("found");


    } catch (erro) {


        mostrarErro(pesquisa);


        alterarLente("error");
    }
}


botaoBuscar.addEventListener("click", buscarPokemon);


campoPokemon.addEventListener("keydown", (evento) => {


    if (evento.key === "Enter") {
        buscarPokemon();
    }


});


function buscarPeloParametroDaUrl() {

    const parametros = new URLSearchParams(window.location.search);
    const idOuNome = parametros.get("id");

    if (!idOuNome) return;

    campoPokemon.value = idOuNome;
    buscarPokemon();
}


buscarPeloParametroDaUrl();