console.log('✅ script.js carregado');

const cabecalho = document.getElementById("header");
const botaoMenu = document.getElementById("nav-toggle");
const menuNav = document.getElementById("nav-menu");

console.log('Header:', cabecalho);
console.log('Botão Menu:', botaoMenu);
console.log('Menu Nav:', menuNav);

function configurarNavegacao() {
  if (!botaoMenu || !menuNav) {
    console.warn('⚠️ Botão de menu ou menu não encontrados');
    return;
  }
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
  if (!cabecalho) {
    console.warn('⚠️ Cabeçalho não encontrado');
    return;
  }
  const aoRolar = () => {
    cabecalho.classList.toggle("scrolled", window.scrollY > 8);
  };

  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });
}

if (botaoMenu && menuNav) {
  configurarNavegacao();
  console.log('✅ Navegação configurada');
}

if (cabecalho) {
  configurarCabecalhoScroll();
  console.log('✅ Scroll do cabeçalho configurado');
}