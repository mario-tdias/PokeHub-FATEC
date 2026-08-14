/**
 * Sistema de Autenticação - JavaScript
 * Gerencia login, registro e validações no frontend
 */

// =============================================
// Configurações
// =============================================

const API_URL = (() => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}/api`;
  }
  return 'http://localhost:3000/api';
})();
const TOKEN_KEY = 'pokehub_token';
const USER_KEY = 'pokehub_usuario';

// =============================================
// Função para Obter IP do Servidor
// =============================================
async function obterIPServidor() {
  try {
    const response = await fetch(`${API_URL}/auth/server-ip`);
    if (response.ok) {
      const data = await response.json();
      console.log('IP do Servidor:', data.ip);
      return data.ip;
    }
  } catch (erro) {
    console.error('Erro ao obter IP do servidor:', erro);
  }
  return 'localhost';
}

// =============================================
// Controle de Visibilidade da Senha
// =============================================

function configurarToggleSenha() {
  const toggles = document.querySelectorAll('.toggle-password');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      
      const input = toggle.previousElementSibling;
      const isPassword = input.type === 'password';
      
      input.type = isPassword ? 'text' : 'password';
      toggle.classList.toggle('visible', !isPassword);
    });
  });
}

// =============================================
// Validação de Email
// =============================================

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// =============================================
// Limpeza de Mensagens de Erro
// =============================================

function limparErros() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  document.getElementById('error-geral').textContent = '';
}

// =============================================
// Exibir Mensagem de Erro
// =============================================

function exibirErro(campo, mensagem) {
  const elemento = document.getElementById(`error-${campo}`);
  if (elemento) {
    elemento.textContent = mensagem;
  }
}

// =============================================
// Exibir Erro Geral
// =============================================

function exibirErroGeral(mensagem) {
  const elemento = document.getElementById('error-geral');
  if (elemento) {
    elemento.textContent = mensagem;
    elemento.style.marginTop = '1rem';
  }
}

// =============================================
// Salvar Token e Usuário
// =============================================

function salvarSessao(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

// =============================================
// Obter Token Armazenado
// =============================================

function obterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// =============================================
// Obter Usuário Armazenado
// =============================================

function obterUsuario() {
  const usuario = localStorage.getItem(USER_KEY);
  return usuario ? JSON.parse(usuario) : null;
}

// =============================================
// Fazer Logout
// =============================================

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '../index.html';
}

// =============================================
// Verificar se Usuário está Autenticado
// =============================================

function estaAutenticado() {
  return obterToken() !== null;
}

// =============================================
// Formulário de LOGIN
// =============================================

function configurarFormLogin() {
  const form = document.getElementById('form-login');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparErros();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Validações
    let temErro = false;

    if (!email) {
      exibirErro('email', 'Email é obrigatório');
      temErro = true;
    } else if (!validarEmail(email)) {
      exibirErro('email', 'Email inválido');
      temErro = true;
    }

    if (!senha) {
      exibirErro('senha', 'Senha é obrigatória');
      temErro = true;
    }

    if (temErro) return;

    // Desabilitar botão
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.innerHTML = '<span class="loading"></span> Entrando...';

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const dados = await response.json();

      if (!response.ok) {
        exibirErroGeral(dados.error || 'Erro ao fazer login');
        botao.disabled = false;
        botao.textContent = 'Entrar';
        return;
      }

      // Login bem-sucedido
      salvarSessao(dados.token, dados.usuario);
      
      // Mostrar mensagem de sucesso
      const sucessoDiv = document.createElement('div');
      sucessoDiv.className = 'success-message';
      sucessoDiv.textContent = '✅ Login realizado com sucesso!';
      form.insertBefore(sucessoDiv, form.firstChild);

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);

    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      exibirErroGeral('Erro ao conectar com o servidor');
      botao.disabled = false;
      botao.textContent = 'Entrar';
    }
  });
}

// =============================================
// Formulário de REGISTRO
// =============================================

function configurarFormRegistro() {
  const form = document.getElementById('form-registro');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparErros();

    const nome = document.getElementById('nome').value.trim();
    const nomeUsuario = document.getElementById('nome_usuario').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const termos = document.getElementById('termos').checked;

    // Validações
    let temErro = false;

    if (!nome) {
      exibirErro('nome', 'Nome é obrigatório');
      temErro = true;
    } else if (nome.length < 3) {
      exibirErro('nome', 'Nome deve ter no mínimo 3 caracteres');
      temErro = true;
    }

    if (!nomeUsuario) {
      exibirErro('nome_usuario', 'Nome de usuário é obrigatório');
      temErro = true;
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(nomeUsuario)) {
      exibirErro('nome_usuario', 'Use de 3 a 20 letras, números ou _');
      temErro = true;
    }

    if (!email) {
      exibirErro('email', 'Email é obrigatório');
      temErro = true;
    } else if (!validarEmail(email)) {
      exibirErro('email', 'Email inválido');
      temErro = true;
    }

    if (!senha) {
      exibirErro('senha', 'Senha é obrigatória');
      temErro = true;
    } else if (senha.length < 8) {
      exibirErro('senha', 'Senha deve ter no mínimo 8 caracteres');
      temErro = true;
    }

    if (senha !== confirmarSenha) {
      exibirErro('confirmar-senha', 'Senhas não coincidem');
      temErro = true;
    }

    if (!termos) {
      exibirErro('termos', 'Você deve concordar com os termos');
      temErro = true;
    }

    if (temErro) return;

    // Desabilitar botão
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.innerHTML = '<span class="loading"></span> Criando conta...';

    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, nome_usuario: nomeUsuario, email, senha })
      });

      const dados = await response.json();

      if (!response.ok) {
        exibirErroGeral(dados.error || 'Erro ao registrar');
        botao.disabled = false;
        botao.textContent = 'Criar Conta';
        return;
      }

      // Registro bem-sucedido
      salvarSessao(dados.token, dados.usuario);
      
      // Mostrar mensagem de sucesso
      const sucessoDiv = document.createElement('div');
      sucessoDiv.className = 'success-message';
      sucessoDiv.textContent = '✅ Conta criada com sucesso!';
      form.insertBefore(sucessoDiv, form.firstChild);

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);

    } catch (erro) {
      console.error('Erro ao registrar:', erro);
      exibirErroGeral('Erro ao conectar com o servidor');
      botao.disabled = false;
      botao.textContent = 'Criar Conta';
    }
  });
}

// =============================================
// Inicialização
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Se usuário já está logado, redirecionar
  if (estaAutenticado() && window.location.pathname.includes('login.html')) {
    window.location.href = '../index.html';
    return;
  }

  if (estaAutenticado() && window.location.pathname.includes('registro.html')) {
    window.location.href = '../index.html';
    return;
  }

  // Obter IP do servidor
  obterIPServidor().then(ip => {
    console.log('Servidor disponível em:', ip);
  });

  // Configurar toggles de senha
  configurarToggleSenha();

  // Configurar formulários
  configurarFormLogin();
  configurarFormRegistro();
});
