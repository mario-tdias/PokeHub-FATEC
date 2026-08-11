const campoPokemon = document.getElementById("pokeInput");
const botaoBuscar = document.getElementById("searchBtn");
const tela = document.getElementById("screen");
const spriteBox = document.getElementById("sprite-box");
const lente = document.getElementById("lens");

function alterarLente(estado) {
  if (lente) {
    lente.className = "lens state-" + estado;
  }
}

function mostrarTelaInicial() {
  if (spriteBox) spriteBox.innerHTML = "";
  if (tela) {
    tela.innerHTML = `
      <div class="ds-placeholder">
        <span class="big">◌</span>
        Digite o nome de um pokémon na tela inferior e pressione buscar
      </div>
    `;
  }
}

function mostrarCarregando() {
  if (spriteBox) spriteBox.innerHTML = "";
  if (tela) {
    tela.innerHTML = `
      <div class="ds-placeholder">
        <span class="big">◐</span>
        Buscando na PokéAPI...
      </div>
    `;
  }
}

function mostrarErro(nomePokemon) {
  if (spriteBox) spriteBox.innerHTML = "";
  if (tela) {
    tela.innerHTML = `
      <div class="error-msg">
        <span class="big">✕</span>
        Pokémon "${nomePokemon}" não encontrado.<br>
        Confira o nome e tente novamente.
      </div>
    `;
  }
}

const TIPOS_PT = {
  normal: "normal", fire: "fogo", water: "água", electric: "elétrico",
  grass: "planta", ice: "gelo", fighting: "lutador", poison: "veneno",
  ground: "terra", flying: "voador", psychic: "psíquico", bug: "inseto",
  rock: "pedra", ghost: "fantasma", dragon: "dragão", dark: "sombrio",
  steel: "aço", fairy: "fada"
};

const HABILIDADES_PT = {
  overgrow: "Crescimento Excessivo", blaze: "Chama", torrent: "Torrente",
  static: "Estático", pressure: "Pressão", synchronize: "Sincronismo",
  intimidate: "Intimidação", levitate: "Levitação", sturdy: "Robustez",
  adaptability: "Adaptabilidade", inner_focus: "Foco Interno", steadfast: "Inabalável"
};

function mostrarPokemon(pokemon) {
  const numero = String(pokemon.id).padStart(3, "0");
  const imagemPokemon =
    pokemon.sprites.other?.showdown?.front_default ||
    pokemon.sprites.other?.official_artwork?.front_default ||
    pokemon.sprites.front_default;

  const tipos = pokemon.types
    .map(tipo => `<span class="type-pill">${TIPOS_PT[tipo.type.name] || tipo.type.name}</span>`)
    .join("");

  const altura = (pokemon.height / 10).toFixed(1);
  const peso = (pokemon.weight / 10).toFixed(1);
  const habilidade = HABILIDADES_PT[pokemon.abilities[0]?.ability?.name] || pokemon.abilities[0]?.ability?.name || "Desconhecida";

  if (spriteBox) {
    spriteBox.innerHTML = `
      <img src="${imagemPokemon}" alt="Sprite oficial do Pokémon ${pokemon.name}" title="${pokemon.name}">
    `;
  }

  if (tela) {
    tela.innerHTML = `
      <div class="ds-info-side">
        <span class="poke-number">Nº ${numero}</span>
        <h2 class="poke-name">${pokemon.name}</h2>
        <div class="poke-types">${tipos}</div>
        
        <div class="ds-info-stack">
          <div class="ds-info-row"><strong>Altura</strong> <span>${altura} m</span></div>
          <div class="ds-info-row"><strong>Peso</strong> <span>${peso} kg</span></div>
          <div class="ds-info-row"><strong>Habilidade</strong> <span>${habilidade}</span></div>
        </div>
      </div>
    `;
  }
}

async function buscarPokemon() {
  if (!campoPokemon) return;
  const pesquisa = campoPokemon.value.trim().toLowerCase();

  if (window.Pokedex3D && !window.Pokedex3D.isZoomed()) {
    window.Pokedex3D.zoomIn();
  }

  if (!pesquisa) {
    mostrarTelaInicial();
    alterarLente("idle");
    return;
  }

  alterarLente("loading");
  mostrarCarregando();

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pesquisa)}`);
    if (!resposta.ok) throw new Error("Pokémon não encontrado");

    const pokemon = await resposta.json();
    mostrarPokemon(pokemon);
    alterarLente("found");
  } catch (erro) {
    mostrarErro(pesquisa);
    alterarLente("error");
  }
}

if (botaoBuscar) botaoBuscar.addEventListener("click", buscarPokemon);
if (campoPokemon) {
  campoPokemon.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarPokemon();
  });
}
