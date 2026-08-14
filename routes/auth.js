const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/registro
 * Registra um novo usuário com autenticação segura
 */
router.post('/registro', async (req, res) => {
  const { email, senha, nome, nome_usuario } = req.body;

  // Validação de entrada
  if (!email || !senha || !nome || !nome_usuario) {
    return res.status(400).json({
      error: 'Email, senha, nome e nome de usuário são obrigatórios'
    });
  }

  if (senha.length < 8) {
    return res.status(400).json({
      error: 'A senha deve ter no mínimo 8 caracteres'
    });
  }

  const nomeUsuarioFormatado = String(nome_usuario).trim();
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(nomeUsuarioFormatado)) {
    return res.status(400).json({
      error: 'Nome de usuário inválido. Use 3 a 20 letras, números ou underscore.'
    });
  }

  try {
    const emailFormatado = email.toLowerCase();

    // Verificar se usuário já existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 OR LOWER(nome_usuario) = LOWER($2)',
      [emailFormatado, nomeUsuarioFormatado]
    );

    if (usuarioExistente.rows.length > 0) {
      const emailJaCadastrado = usuarioExistente.rows.some((usuario) => usuario.email === emailFormatado);
      if (emailJaCadastrado) {
        return res.status(409).json({
          error: 'Email já cadastrado'
        });
      }

      return res.status(409).json({
        error: 'Nome de usuário já cadastrado'
      });
    }

    // Hash da senha com bcrypt (10 rounds)
    const senhaHash = await bcrypt.hash(senha, 10);
    const agora = new Date();

    // Inserir novo usuário
    const resultado = await pool.query(
      `INSERT INTO usuarios (email, senha_hash, nome, nome_usuario, data_criacao, ativo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, nome, nome_usuario, data_criacao`,
      [emailFormatado, senhaHash, nome, nomeUsuarioFormatado, agora, true]
    );

    const usuario = resultado.rows[0];

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        nome: usuario.nome 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      mensagem: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario
      }
    });

  } catch (erro) {
    console.error('❌ Erro ao registrar usuário:', erro.message);
    res.status(500).json({
      error: 'Erro ao registrar usuário',
      detalhes: process.env.NODE_ENV === 'development' ? erro.message : undefined
    });
  }
});

/**
 * POST /api/auth/login
 * Autentica um usuário existente
 */
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Validação de entrada
  if (!email || !senha) {
    return res.status(400).json({
      error: 'Email e senha são obrigatórios'
    });
  }

  try {
    // Buscar usuário
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    const usuario = resultado.rows[0];

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return res.status(403).json({
        error: 'Usuário desativado'
      });
    }

    // Comparar senha com hash
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    // Atualizar último acesso
    await pool.query(
      'UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = $1',
      [usuario.id]
    );

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        nome: usuario.nome 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario
      }
    });

  } catch (erro) {
    console.error('❌ Erro ao fazer login:', erro.message);
    res.status(500).json({
      error: 'Erro ao fazer login',
      detalhes: process.env.NODE_ENV === 'development' ? erro.message : undefined
    });
  }
});

/**
 * GET /api/auth/perfil
 * Retorna dados do usuário autenticado
 */
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, email, nome, nome_usuario, data_criacao, ultimo_acesso FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error('❌ Erro ao obter perfil:', erro.message);
    res.status(500).json({
      error: 'Erro ao obter perfil'
    });
  }
});

/**
 * PUT /api/auth/atualizar-perfil
 * Atualiza dados do perfil do usuário
 */
router.put('/atualizar-perfil', verificarToken, async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Nome é obrigatório'
    });
  }

  try {
    const resultado = await pool.query(
      'UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING id, email, nome',
      [nome, req.usuario.id]
    );

    res.json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error('❌ Erro ao atualizar perfil:', erro.message);
    res.status(500).json({
      error: 'Erro ao atualizar perfil'
    });
  }
});

/**
 * POST /api/auth/logout
 * Middleware de logout (apenas marca no cliente)
 */
router.post('/logout', verificarToken, (req, res) => {
  // O logout real é feito no cliente removendo o token
  res.json({
    mensagem: 'Logout realizado com sucesso'
  });
});

module.exports = router;
