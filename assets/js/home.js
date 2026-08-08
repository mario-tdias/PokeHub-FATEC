const pokemonsEncontro = [
  {
    id: 6,
    nome: "Charizard",
    tipo: "Fogo",
    classeTipo: "type-fire",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    id: 151,
    nome: "Mew",
    tipo: "Psíquico",
    classeTipo: "type-psychic",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
  },
  {
    id: 25,
    nome: "Pikachu",
    tipo: "Elétrico",
    classeTipo: "type-electric",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    id: 94,
    nome: "Gengar",
    tipo: "Fantasma",
    classeTipo: "type-ghost",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    id: 1,
    nome: "Bulbasaur",
    tipo: "Planta",
    classeTipo: "type-grass",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    id: 7,
    nome: "Squirtle",
    tipo: "Água",
    classeTipo: "type-water",
    imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  },
];

const NUMERO_TOUCEIRAS = 6;
const FRASES_GRAMA_VAZIA = [
  "Só o vento balançou a grama...",
  "Nada por aqui, tente outra touceira.",
  "Silêncio... nenhum Pokémon apareceu.",
];

const campo = document.getElementById("encounter-field");
const mensagem = document.getElementById("encounter-message");
const painel = document.getElementById("encounter-panel");
const imagemPainel = document.getElementById("encounter-img");
const linhaPainel = document.getElementById("encounter-line");
const tipoPainel = document.getElementById("encounter-type");
const linkPainel = document.getElementById("encounter-view-link");
const botaoProximo = document.getElementById("encounter-next");

let filaPokemon = [];
let pokemonAtual = null;
let indiceEscondido = -1;
let emAnimacao = false;
let timeoutMensagem = null;

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function proximoPokemon() {
  if (filaPokemon.length === 0) {
    filaPokemon = embaralhar(pokemonsEncontro);
  }
  return filaPokemon.pop();
}

function criarTouceiras() {
  campo.innerHTML = "";
  for (let i = 0; i < NUMERO_TOUCEIRAS; i++) {
    const touceira = document.createElement("button");
    touceira.type = "button";
    touceira.className = "grass-tuft";
    touceira.dataset.index = String(i);
    touceira.setAttribute("aria-label", `Touceira de grama ${i + 1}`);
    touceira.style.setProperty("--sway-delay", `${(i * 0.18).toFixed(2)}s`);
    touceira.innerHTML = `
      <span class="grass-tuft-shadow" aria-hidden="true"></span>
      <svg viewBox="0 0 80 110" aria-hidden="true"><use href="#grass-tuft-shape"></use></svg>
    `;
    touceira.addEventListener("click", () => tratarClique(touceira, i));
    campo.appendChild(touceira);
  }
}

function iniciarRodada() {
  emAnimacao = false;
  pokemonAtual = proximoPokemon();
  indiceEscondido = Math.floor(Math.random() * NUMERO_TOUCEIRAS);
  painel.hidden = true;
  clearTimeout(timeoutMensagem);
  mensagem.classList.remove("is-visible");

  campo.querySelectorAll(".grass-tuft").forEach((touceira) => {
    touceira.classList.remove("is-checked", "is-found", "is-rustling");
    touceira.removeAttribute("aria-disabled");
    const bolinha = touceira.querySelector(".pokeball");
    const sprite = touceira.querySelector(".encounter-sprite");
    if (bolinha) bolinha.remove();
    if (sprite) sprite.remove();
  });
}

function mostrarMensagem(texto) {
  clearTimeout(timeoutMensagem);
  mensagem.textContent = texto;
  mensagem.classList.add("is-visible");
  timeoutMensagem = setTimeout(() => {
    mensagem.classList.remove("is-visible");
  }, 1600);
}

function tratarClique(touceira, indice) {
  if (emAnimacao || touceira.classList.contains("is-checked")) return;

  if (indice !== indiceEscondido) {
    touceira.classList.add("is-rustling", "is-checked");
    const frase = FRASES_GRAMA_VAZIA[Math.floor(Math.random() * FRASES_GRAMA_VAZIA.length)];
    mostrarMensagem(frase);
    setTimeout(() => touceira.classList.remove("is-rustling"), 500);
    return;
  }

  emAnimacao = true;
  campo.querySelectorAll(".grass-tuft").forEach((t) => t.setAttribute("aria-disabled", "true"));
  touceira.classList.add("is-found");

  const bolinha = document.createElement("span");
  bolinha.className = "pokeball";
  bolinha.setAttribute("aria-hidden", "true");
  bolinha.innerHTML = `<span class="pokeball-button"></span>`;
  touceira.appendChild(bolinha);

  setTimeout(() => {
    bolinha.classList.add("is-opening");
  }, 1550);

  setTimeout(() => {
    bolinha.remove();
    revelarPokemon(touceira);
  }, 1980);
}

function revelarPokemon(touceira) {
  const sprite = document.createElement("img");
  sprite.className = "encounter-sprite";
  sprite.src = pokemonAtual.imagem;
  sprite.alt = pokemonAtual.nome;
  sprite.width = 84;
  sprite.height = 84;
  touceira.appendChild(sprite);

  imagemPainel.src = pokemonAtual.imagem;
  imagemPainel.alt = pokemonAtual.nome;
  linhaPainel.textContent = `Um ${pokemonAtual.nome} selvagem apareceu!`;
  tipoPainel.textContent = pokemonAtual.tipo;
  tipoPainel.className = `type-badge ${pokemonAtual.classeTipo}`;
  linkPainel.href = `pages/pokedex.html?id=${pokemonAtual.id}`;
  painel.hidden = false;
  emAnimacao = false;
}

if (campo) {
  criarTouceiras();
  iniciarRodada();
}

if (botaoProximo) {
  botaoProximo.addEventListener("click", iniciarRodada);
}