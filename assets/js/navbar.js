/**
 * Gerenciador de Autenticação na Navbar
 * Controla a visibilidade dos botões de Login/Logout
 */

const TOKEN_KEY = 'pokehub_token';
const USER_KEY = 'pokehub_usuario';

/**
 * Obter token armazenado
 */
function obterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Obter usuário armazenado
 */
function obterUsuario() {
  const usuario = localStorage.getItem(USER_KEY);
  return usuario ? JSON.parse(usuario) : null;
}

/**
 * Verificar se usuário está autenticado
 */
function estaAutenticado() {
  return obterToken() !== null;
}

/**
 * Fazer logout
 */
function fazerLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.reload();
}

/**
 * Atualizar estado da navbar
 */
function atualizarEstadoNavbar() {
  const botaoLogin = document.getElementById('nav-login-btn');
  const navUserMenu = document.getElementById('nav-user-menu');
  const botaoUsuario = document.getElementById('nav-user-btn');
  const nomeUsuario = document.getElementById('nav-user-name');

  if (!botaoLogin && !navUserMenu) {
    return;
  }

  if (estaAutenticado()) {
    const usuario = obterUsuario();
    const nomeExibicao = usuario?.nome_usuario || usuario?.nome || 'Usuário';

    if (botaoLogin) {
      botaoLogin.hidden = true;
      botaoLogin.style.display = 'none';
    }

    if (navUserMenu && botaoUsuario && nomeUsuario) {
      navUserMenu.hidden = false;
      botaoUsuario.setAttribute('aria-expanded', 'false');
      nomeUsuario.textContent = nomeExibicao;
      navUserMenu.classList.remove('open');
    }
  } else {
    if (botaoLogin) {
      botaoLogin.hidden = false;
      botaoLogin.style.display = 'inline-flex';
    }

    if (navUserMenu) {
      navUserMenu.hidden = true;
      navUserMenu.classList.remove('open');
    }
  }
}

/**
 * Inicializar
 */
document.addEventListener('DOMContentLoaded', () => {
  atualizarEstadoNavbar();

  const botaoUsuario = document.getElementById('nav-user-btn');
  const navUserMenu = document.getElementById('nav-user-menu');
  const botaoLogout = document.getElementById('nav-logout-btn');

  if (botaoUsuario) {
    botaoUsuario.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!navUserMenu || navUserMenu.hidden) return;

      const estaAberto = navUserMenu.classList.toggle('open');
      botaoUsuario.setAttribute('aria-expanded', String(estaAberto));
    });
  }

  if (botaoLogout) {
    botaoLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Deseja realmente fazer logout?')) {
        fazerLogout();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (navUserMenu && !navUserMenu.contains(event.target)) {
      navUserMenu.classList.remove('open');
      if (botaoUsuario) {
        botaoUsuario.setAttribute('aria-expanded', 'false');
      }
    }
  });

  window.addEventListener('storage', () => {
    atualizarEstadoNavbar();
  });
});
