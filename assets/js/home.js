const pokemonsDestaque = [
  {
    nome: "Charizard",
    tipo: "Fogo",
    classeTipo: "type-fire",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    nome: "Mew",
    tipo: "Psiquico",
    classeTipo: "type-psychic",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
  },
  {
    nome: "Pikachu",
    tipo: "Elétrico",
    classeTipo: "type-electric",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    nome: "Gengar",
    tipo: "Fantasma",
    classeTipo: "type-ghost",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
];

const gradePokemon = document.getElementById("pokemon-grid");

function renderizarPokemonsDestaque() {
  gradePokemon.innerHTML = pokemonsDestaque
    .map(
      (pokemon) => `
      <article class="pokemon-card">
        <img src="${pokemon.imagem}" alt="${pokemon.nome}" width="120" height="120" loading="lazy" />
        <h3>${pokemon.nome}</h3>
        <span class="type-badge ${pokemon.classeTipo}">${pokemon.tipo}</span>
        <a href="pages/pokedex.html" class="btn btn-ghost">Ver detalhes</a>
      </article>
    `
    )
    .join("");
}

if (gradePokemon) {
  renderizarPokemonsDestaque();
}

function animarContadores() {
  const numeros = document.querySelectorAll(".stat-number");
  if (!numeros.length) return;

  const duracao = 1400;

  const anima = (elemento) => {
    const alvo = Number(elemento.dataset.target);
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      elemento.textContent = Math.round(alvo * suavizado).toLocaleString("pt-BR");
      if (progresso < 1) requestAnimationFrame(passo);
    }

    requestAnimationFrame(passo);
  };

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          numeros.forEach(anima);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  const barra = document.getElementById("stats-bar");
  if (barra) observador.observe(barra);
}

function iniciarCountdown() {
  const elDias = document.getElementById("cd-days");
  const elHoras = document.getElementById("cd-hours");
  const elMin = document.getElementById("cd-min");
  if (!elDias || !elHoras || !elMin) return;

  const dataEvento = new Date("2026-08-14T14:00:00-03:00").getTime();

  function atualizar() {
    const agora = Date.now();
    const diferenca = dataEvento - agora;

    if (diferenca <= 0) {
      elDias.textContent = "00";
      elHoras.textContent = "00";
      elMin.textContent = "00";
      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);

    elDias.textContent = String(dias).padStart(2, "0");
    elHoras.textContent = String(horas).padStart(2, "0");
    elMin.textContent = String(minutos).padStart(2, "0");
  }

  atualizar();
  setInterval(atualizar, 60 * 1000);
}

animarContadores();
iniciarCountdown();