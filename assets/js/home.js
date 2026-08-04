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