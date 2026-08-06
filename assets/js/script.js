const cabecalho = document.getElementById("header");
const botaoMenu = document.getElementById("nav-toggle");
const menuNav = document.getElementById("nav-menu");

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

if (botaoMenu && menuNav) {
  configurarNavegacao();
}

if (cabecalho) {
  configurarCabecalhoScroll();
}

