const pokemonsDestaque = [
  {
    nome: "Charizard",
    tipo: "Fogo",
    classeTipo: "type-fire",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    nome: "Blastoise",
    tipo: "Água",
    classeTipo: "type-water",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
  },
  {
    nome: "Pikachu",
    tipo: "Elétrico",
    classeTipo: "type-electric",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    nome: "Venusaur",
    tipo: "Planta",
    classeTipo: "type-grass",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
  },
];

const cabecalho = document.getElementById("header");
const botaoMenu = document.getElementById("nav-toggle");
const menuNav = document.getElementById("nav-menu");
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

function configurarNavegacao() {
  botaoMenu.addEventListener("click", () => {
    const menuAberto = menuNav.classList.toggle("open");
    botaoMenu.setAttribute("aria-expanded", String(menuAberto));
    botaoMenu.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
  });

  menuNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuNav.classList.remove("open");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
    });
  });
}

function configurarCabecalhoScroll() {
  const aoRolar = () => {
    cabecalho.classList.toggle("scrolled", window.scrollY > 8);
  };

  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });
}

renderizarPokemonsDestaque();
configurarNavegacao();
configurarCabecalhoScroll();