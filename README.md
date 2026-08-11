# ⚡ PokéHub Fatec

<p align="center">
  <img src="https://github.com/user-attachments/assets/4d36074a-95fb-4c33-847b-e6906d71727e" alt="Logo PokéHub Fatec" width="100%" style="max-width: 800px;">
</p>


> A plataforma da comunidade Pokémon para estudantes da **FATEC Registro / SP**.

---

## 📌 Sobre o Projeto

O **PokéHub Fatec** é um projeto web desenvolvido para conectar estudantes e entusiastas do universo Pokémon na FATEC Registro. A plataforma oferece uma Pokédex interativa, busca de cartas do TCG em tempo real, rankings comunitários e informações sobre eventos locais.

A identidade visual do projeto presta uma homenagem à cidade de Registro/SP, incorporando o icônico **Monumento da Imigração Japonesa (Tomie Ohtake)** estilizado com Pokébolas no logotipo principal.

---

## 🚀 Funcionalidades

- 📖 **Pokédex Interativa:** Consulta de Pokémon em destaque com tipos e atributos.
- 🃏 **Busca TCG (Pokémon TCG API):** Pesquisa de cartas de Baralho Pokémon em tempo real, trazendo raridade traduzida, coleções, artista e preços de mercado (TCGPlayer/Cardmarket).
- 🎴 **Efeito Holofote (Holográfico):** Efeito visual dinâmico em 3D interativo ao passar o cursor sobre as cartas do TCG.
- 🎨 **Design Temático Dark Mode:** Interface moderna estilizada com CSS Grid, Flexbox e variáveis customizadas.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica e acessível.
- **CSS3:** Flexbox, Grid, Variáveis CSS, Animações e seletor moderno `:has()`.
- **JavaScript (ES6+):** Manipulação assíncrona da DOM e consumo de APIs via `fetch`.
- **APIs Externas:** [Pokémon TCG API](https://pokemontcg.io/) para consulta de cartas.
- **Git & GitHub:** Controle de versão em equipe utilizando *feature branches* e *Pull Requests*.

---

## 📂 Estrutura de Pastas

```text
pokehub-fatec/
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   ├── navbar.css
│   │   ├── style.css
│   │   └── tcg.css
│   ├── js/
│   │   ├── home.js
│   │   ├── script.js
│   │   └── tcg.js
│   └── img/
├── pages/
│   ├── comunidade.html
│   ├── eventos.html
│   ├── pokedex.html
│   ├── ranking.html
│   └── tcg.html
├── index.html
└── README.md
```

---

## 🔧 Como Executar o Projeto Localmente

Não é necessário instalar dependências de backend. Para testar o projeto:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/mario-tdias/PokeHub-FATEC.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd PokeHub-FATEC
   ```

3. **Abra o arquivo principal:**
   Execute o arquivo `index.html` em qualquer navegador web ou utilize a extensão **Live Server** no VS Code.

---

## 👥 Contribuidores

Este projeto foi desenvolvido em colaboração pelos alunos da FATEC Registro:

* [Mario Dias](https://github.com/mario-tdias)
* [Millie Morelli](https://github.com/mzmorelli)
* [Luiz Henrique Cubas](https://github.com/luizscubas)
* [Enzo Davis Xavier](https://github.com/EnzoDavisXavier)

---

## 📄 Licença

Este projeto é desenvolvido estritamente para fins educacionais. Todas as imagens, nomes e marcas de Pokémon são propriedades intelectuais da © Nintendo, Game Freak e Creatures Inc.
