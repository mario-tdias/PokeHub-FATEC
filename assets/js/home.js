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