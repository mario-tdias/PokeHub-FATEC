const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'pokehub_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function ensureUsuarioSchema() {
  const client = await pool.connect();

  try {
    await client.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS nome_usuario VARCHAR(50);
    `);

    await client.query(`
      UPDATE usuarios
      SET nome_usuario = LOWER(REPLACE(nome, ' ', '_'))
      WHERE nome_usuario IS NULL;
    `);

    await client.query(`
      ALTER TABLE usuarios
      ALTER COLUMN nome_usuario TYPE VARCHAR(50);
    `);

    await client.query(`
      UPDATE usuarios
      SET nome_usuario = CONCAT('user_', id)
      WHERE nome_usuario IS NULL OR nome_usuario = '';
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_nome_usuario_unique
      ON usuarios (LOWER(nome_usuario));
    `);

  } catch (error) {
    console.error('❌ Erro ao ajustar schema de usuários:', error.message);
  } finally {
    client.release();
  }
}

pool.on('error', (err) => {
  console.error('❌ Erro no pool de conexão:', err);
});

pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.ensureUsuarioSchema = ensureUsuarioSchema;

module.exports = pool;
