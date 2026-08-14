const { Pool } = require('pg');
require('dotenv').config();

/**
 * Script para criar e configurar o banco de dados PostgreSQL
 * Execute com: npm run setup-db
 */

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados PostgreSQL...\n');

  // Primeiro, conectar ao banco padrão 'postgres'
  const poolAdmin = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Banco padrão
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: false
  });

  try {
    // 1. Criar banco de dados
    console.log('1️⃣  Criando banco de dados...');
    const dbName = process.env.DB_NAME || 'pokehub_db';
    
    try {
      await poolAdmin.query(`DROP DATABASE IF EXISTS ${dbName}`);
      console.log('   ✓ Banco de dados anterior removido');
    } catch (err) {
      // Pode falhar se não existir, é ok
    }

    await poolAdmin.query(`CREATE DATABASE ${dbName}`);
    console.log(`   ✓ Banco de dados '${dbName}' criado\n`);

    await poolAdmin.end();

    // 2. Conectar ao novo banco
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: false
    });

    // 3. Criar tabelas
    console.log('2️⃣  Criando tabelas...\n');

    // Tabela de usuários
    console.log('   Criando tabela "usuarios"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        bio TEXT,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ultimo_acesso TIMESTAMP,
        ativo BOOLEAN DEFAULT TRUE,
        deletado_em TIMESTAMP,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS nome_usuario VARCHAR(50);
    `);

    await pool.query(`
      UPDATE usuarios
      SET nome_usuario = LOWER(REPLACE(nome, ' ', '_'))
      WHERE nome_usuario IS NULL;
    `);

    await pool.query(`
      ALTER TABLE usuarios
      ALTER COLUMN nome_usuario TYPE VARCHAR(50),
      ALTER COLUMN nome_usuario SET NOT NULL;
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_nome_usuario_unique
      ON usuarios (LOWER(nome_usuario));
    `);

    console.log('   ✓ Tabela "usuarios" criada');

    // Índices para performance
    console.log('   Criando índices...');
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_nome_usuario ON usuarios(nome_usuario);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_criado_em ON usuarios(criado_em);`);
    console.log('   ✓ Índices criados\n');

    // Tabela de sessões (opcional, para gerenciamento de tokens)
    console.log('   Criando tabela "sessoes"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessoes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        token_hash VARCHAR(500) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_expiracao TIMESTAMP NOT NULL,
        ativa BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('   ✓ Tabela "sessoes" criada\n');

    // Tabela de atividades de login (auditoria)
    console.log('   Criando tabela "atividades_login"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS atividades_login (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL, -- 'login', 'logout', 'registro', 'falha'
        ip_address VARCHAR(45),
        user_agent TEXT,
        status VARCHAR(20) NOT NULL, -- 'sucesso', 'falha'
        mensagem_erro TEXT,
        data_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ Tabela "atividades_login" criada\n');

    // 4. Criar usuário de teste (opcional)
    console.log('3️⃣  Inserindo dados de teste...');
    const bcrypt = require('bcryptjs');
    const senhaHash = await bcrypt.hash('teste123456', 10);

    await pool.query(
      `INSERT INTO usuarios (email, senha_hash, nome, nome_usuario, bio)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING;`,
      [
        'teste@pokehub.com',
        senhaHash,
        'Usuário Teste',
        'teste',
        'Este é um usuário de teste do PokéHub FATEC'
      ]
    );
    console.log('   ✓ Usuário de teste inserido (teste@pokehub.com / teste123456)\n');

    // 5. Verificar dados
    console.log('4️⃣  Verificando dados...');
    const usuarios = await pool.query('SELECT COUNT(*) as total FROM usuarios;');
    console.log(`   ✓ Total de usuários: ${usuarios.rows[0].total}\n`);

    console.log('═════════════════════════════════════════');
    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('═════════════════════════════════════════\n');
    console.log('📝 Credenciais de teste:');
    console.log('   Email: teste@pokehub.com');
    console.log('   Senha: teste123456\n');
    console.log('⚠️  IMPORTANTE: Altere a senha padrão em produção!\n');

    await pool.end();

  } catch (erro) {
    console.error('❌ Erro ao configurar banco de dados:');
    console.error(erro.message);
    console.error('\n📋 Verifique:');
    console.error('   1. PostgreSQL está instalado e rodando');
    console.error('   2. Credenciais no arquivo .env estão corretas');
    console.error('   3. Porta do PostgreSQL (padrão 5432) está acessível\n');
    process.exit(1);
  }
}

// Executar setup
setupDatabase();
