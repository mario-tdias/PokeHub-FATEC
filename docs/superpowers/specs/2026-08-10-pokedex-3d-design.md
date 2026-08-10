# Especificação de Design: Pokédex 3D Interativa — PokéHub FATEC

## 1. Visão Geral

O objetivo desta funcionalidade é reestilizar a página da Pokédex (`pages/pokedex.html`) do projeto PokéHub FATEC, integrando um objeto 3D interativo renderizado em WebGL com **Three.js**.

O usuário poderá visualizar a Pokédex em 3D, interagir com ela movimentando o mouse (efeito de inclinação/parallax 3D) e, ao clicar, a câmera fará uma transição de aproximação (zoom) focando na tela da Pokédex. Ao aproximar, uma moldura em PNG fornecida pelo usuário e a interface de busca HTML/CSS serão ativadas para consulta de Pokémon via PokéAPI.

---

## 2. Paleta de Cores e Identidade Visual

A interface manterá total fidelidade ao sistema de design global do PokéHub FATEC (`assets/css/global.css`):

- **Fundo Principal (`--bg`)**: `#0c0e12`
- **Containers Elevados (`--bg-elevated`)**: `#141820`
- **Cards da Interface (`--bg-card`)**: `#1a1f2a`
- **Destaques e Botões Principais (`--red`)**: `#d32f2f` e `#b71c1c` (`--red-dark`)
- **Acentos e Bordas de Foco (`--yellow`)**: `#ffd54f`
- **Texto Principal (`--text`)**: `#f5f5f5`
- **Texto Secundário (`--text-muted`)**: `#9aa3b2`
- **Tipografia**: `"Outfit"`, `"Space Grotesk"`, `"Space Mono"`, `"Baloo 2"`

---

## 3. Estrutura e Componentes da Interface

### 3.1 Página HTML (`pages/pokedex.html`)
- Substituição da estrutura de Pokédex CSS estática por um container 3D dinâmico `#pokedex3d-container`.
- Adição do canvas WebGL `#pokedex3d-canvas`.
- Inclusão da camada de overlay contendo a moldura PNG fornecida pelo usuário, a tela de exibição dos Pokémons, o campo de busca (`#pokeInput`), o botão de busca (`#searchBtn`) e o botão de restauração da visão 3D (`#resetViewBtn`).
- Carregamento do Three.js e `GLTFLoader` via módulos JS ou scripts.

### 3.2 Overlay PNG e Camada Interativa HTML (`assets/css/pages/pokedex.css`)
- Estilização do container `#pokedex3d-container` como uma área de viewport responsiva (altura flexível min 500px, máx 750px).
- Posicionamento absoluto da camada overlay com `pointer-events: none` quando em visão afastada 3D e `pointer-events: auto` quando aproximado (zoom ativo).
- Transição suave de opacidade e visibilidade (`opacity 0.4s ease`).
- Adaptação responsiva para telas menores (mobile/tablet).

---

## 4. Arquitetura 3D (Three.js & GLTFLoader)

### 4.1 Configuração da Cena 3D (`assets/js/pokedex3d.js` ou integrado em `assets/js/pokedex.js`)
- **Cena**: `THREE.Scene` com iluminação ambiente (`AmbientLight`) e direcional (`DirectionalLight`) com projeção de sombras para ressaltar detalhes tridimensionais.
- **Câmera**: `THREE.PerspectiveCamera` (FOV ~45°, corte de plano de 0.1 a 1000).
- **Renderizador**: `THREE.WebGLRenderer` com `alpha: true` (fundo transparente sincronizado com a página) e `antialias: true`.

### 4.2 Carregamento do Modelo `.glb` / `.gltf` e Fallback
- O carregador tenta obter o arquivo 3D localizado em `assets/models/pokedex.glb`.
- **Mecanismo de Fallback Procedural**: Se o arquivo `.glb` ainda não tiver sido colocado no diretório (ou falhar no download), o script gera programmaticamente uma Pokédex 3D conceitual em Three.js (geometrias em cubo arredondado, textura de tela e lente espelhada) garantindo funcionamento ininterrupto da aplicação.

---

## 5. Interações, Animações e Câmera

1. **Efeito Parallax no Hover (Visão Afastada)**:
   - Evento `pointermove` monitora a posição relativa do cursor em relação ao canvas.
   - A rotação do modelo 3D ajusta-se suavemente nos eixos X e Y usando interpolação `lerp` (`rotation.x += (targetX - rotation.x) * 0.05`).

2. **Transição de Zoom ao Clicar**:
   - Clique no canvas/modelo altera o estado para `isZoomed = true`.
   - A posição da câmera `(camera.position)` e o ponto de foco `(camera.lookAt)` realizam uma transição animada suave em direção à tela do modelo 3D.
   - O overlay PNG e os controles de busca HTML ganham visibilidade total (`opacity: 1`, `pointer-events: auto`).

3. **Restaurar Visão 3D (`#resetViewBtn`)**:
   - Clique no botão flutuante **"↺ Visão 3D"** altera `isZoomed = false`.
   - A câmera interpola de volta para a posição perspectiva original.
   - A inclinação por cursor do mouse é reativada.

---

## 6. Integração com a PokéAPI e Indicador de Lente

- Mantém o consumo assíncrono da PokéAPI (`https://pokeapi.co/api/v2/pokemon/{pesquisa}`).
- Dicionários de tradução mantidos (`TIPOS_PT`, `HABILIDADES_PT`).
- **Renderização dos Dados**:
  - Imagem do Pokémon (sprites de *Showdown* ou *Official Artwork*).
  - Número formatado com 3 dígitos (ex: `Nº 025`).
  - Nome do Pokémon com primeira letra maiúscula.
  - Badges de tipos estilizados.
  - Grade de especificações (Altura em metros, Peso em kg, Habilidade principal em português).
- **Lente de Status (`#lens`)**:
  - `idle`: Lente azul reflexiva.
  - `loading`: Lente amarela com pulsação brilhante durante o `fetch`.
  - `found`: Lente verde com brilho intenso ao encontrar o Pokémon.
  - `error`: Lente vermelha em caso de busca sem resultado.

---

## 7. Plano de Verificação e Testes

1. **Teste da Renderização 3D**:
   - Verificar se o canvas Three.js inicializa corretamente sem erros no console.
   - Confirmar o funcionamento do fallback 3D caso o arquivo `.glb` não exista no caminho especificado.
2. **Teste de Interação do Mouse**:
   - Testar o efeito tilt/parallax ao mover o ponteiro.
   - Testar o clique no objeto 3D para acionar a transição de câmera (zoom).
3. **Teste da Overlay PNG e Formulário**:
   - Confirmar o aparecimento suave da overlay PNG e dos campos de texto ao aproximar.
   - Testar o botão "↺ Visão 3D" para afastar a câmera.
4. **Teste de Integração da PokéAPI**:
   - Buscar Pokémons conhecidos (ex: `pikachu`, `charizard`, `1`).
   - Testar Pokémons inexistentes para validar mensagem e lente de erro.
