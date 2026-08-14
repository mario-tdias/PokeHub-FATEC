const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');

const serverConfig = require('./config/server-config');
const authRoutes = require('./routes/auth');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

pool.ensureUsuarioSchema?.().catch((error) => {
  console.error('❌ Falha na migração inicial do schema:', error.message);
});

// =====================
// Middlewares de Segurança
// =====================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: true,
  credentials: true
}));

// =====================
// Middlewares de Parsing
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Arquivos Estáticos
// =====================
app.use(express.static(path.join(__dirname), {
  dotfiles: 'allow'
}));

// Servir HTML para rotas não-API
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath);
});

// =====================
// Rotas da API
// =====================
app.use('/api/auth', authRoutes);

// =====================
// Rota Health Check
// =====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    serverIP: serverConfig.getServerIP()
  });
});

// =====================
// Rota para Obter IP do Servidor
// =====================
app.get('/api/server-ip', (req, res) => {
  res.json({
    ip: serverConfig.getServerIP(),
    port: PORT
  });
});

// =====================
// Tratamento de Erros 404
// =====================
app.use((req, res) => {
  // Se for requisição de API, retornar JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Rota não encontrada' });
  }
  // Para outras requisições, servir index.html (SPA)
  res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================
// Inicialização do Servidor
// =====================
app.listen(PORT, () => {
  const serverIP = serverConfig.getServerIP();
  console.log('═════════════════════════════════════════');
  console.log('🎮 PokéHub FATEC - Servidor em Execução');
  console.log('═════════════════════════════════════════');
  console.log(`✅ Servidor rodando em: http://${serverIP}:${PORT}`);
  console.log(`📍 IP Local: ${serverIP}`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('═════════════════════════════════════════');
});

// =====================
// Tratamento de Erros Não Capturados
// =====================
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise Rejected:', reason);
  console.error('Promise:', promise);
});

module.exports = app;
