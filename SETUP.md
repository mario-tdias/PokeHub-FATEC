# PokeHub FATEC - Guia de Instalação e Configuração

## 📋 Requisitos Pré-requisitos

- **Node.js** (v16+) e **npm**
- **PostgreSQL** (v12+)
- **Git**

---

## 🚀 Instalação

### 1️⃣ Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd PokeHub-FATEC
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Configurar PostgreSQL

#### No Windows (se não tem PostgreSQL instalado):

1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga os passos
3. Lembre-se da senha do usuário `postgres`

#### Verificar se PostgreSQL está rodando:

```bash
# Windows (PowerShell)
Get-Service postgresql-x64-*

# Se não estiver rodando:
Start-Service postgresql-x64-15
```

### 4️⃣ Configurar Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto baseado em `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokehub_db
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres

PORT=3000
NODE_ENV=development

JWT_SECRET=sua_chave_secreta_muito_segura_aqui_mude_isto
JWT_EXPIRES_IN=24

CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE:** 
- Altere a senha padrão em produção
- Gere uma chave JWT segura (use uma ferramenta online ou: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 5️⃣ Criar e Configurar o Banco de Dados

```bash
npm run setup-db
```

Este comando vai:
- Criar o banco de dados `pokehub_db`
- Criar todas as tabelas necessárias
- Inserir um usuário de teste

**Credenciais de teste:**
- Email: `teste@pokehub.com`
- Senha: `teste123456`

---

## 🎮 Iniciar o Servidor

### Modo Desenvolvimento (com reload automático)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## 🌐 Acessar a Aplicação

- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/pages/login.html
- **Registrar:** http://localhost:3000/pages/registro.html

---

## 🔐 Segurança Implementada

### Autenticação
- ✅ Hash de senhas com **bcryptjs** (10 rounds)
- ✅ Tokens JWT com expiração configurável
- ✅ Validação de email e força de senha
- ✅ CORS configurável por ambiente

### Banco de Dados
- ✅ Queries parameterizadas contra SQL Injection
- ✅ Índices para performance
- ✅ Controle de acesso por usuário
- ✅ Auditoria de atividades de login

### Servidor
- ✅ Helmet.js para headers de segurança
- ✅ Rate limiting (recomendado em produção)
- ✅ Variáveis de ambiente sensibilizadas

---

## 📁 Estrutura do Projeto

```
PokeHub-FATEC/
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   ├── navbar.css
│   │   ├── style.css
│   │   ├── auth.css          # ✨ Novo: Estilos de login/registro
│   │   └── pages/
│   └── js/
│       ├── script.js
│       ├── home.js
│       ├── pokedex.js
│       ├── auth.js           # ✨ Novo: Lógica de autenticação
│       └── modules/
├── pages/
│   ├── login.html            # ✨ Novo: Página de login
│   ├── registro.html         # ✨ Novo: Página de registro
│   ├── pokedex.html
│   └── tcg.html
├── config/
│   ├── database.js           # ✨ Novo: Configuração PostgreSQL
│   └── server-config.js      # ✨ Novo: Detecção automática de IP
├── routes/
│   └── auth.js               # ✨ Novo: Rotas de autenticação
├── middleware/
│   └── auth.js               # ✨ Novo: Middleware JWT
├── scripts/
│   └── setup-database.js     # ✨ Novo: Setup do banco de dados
├── server.js                 # ✨ Novo: Servidor Express
├── package.json              # ✨ Novo: Dependências Node.js
├── .env.example              # ✨ Novo: Template de variáveis
└── README.md
```

---

## 🔗 API Endpoints

### Autenticação

#### Registrar Novo Usuário
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123456"
}
```

**Respostas:**
- `201` - Usuário criado com sucesso
- `400` - Dados inválidos
- `409` - Email já cadastrado

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "teste@pokehub.com",
  "senha": "teste123456"
}
```

**Resposta (200):**
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "teste@pokehub.com",
    "nome": "Usuário Teste"
  }
}
```

---

#### Obter Perfil (Requer Autenticação)
```http
GET /api/auth/perfil
Authorization: Bearer <token>
```

---

#### Atualizar Perfil (Requer Autenticação)
```http
PUT /api/auth/atualizar-perfil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Novo Nome"
}
```

---

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

#### Obter IP do Servidor
```http
GET /api/server-ip

Resposta:
{
  "ip": "192.168.1.100",
  "port": 3000
}
```

---

## 🐛 Troubleshooting

### "Erro ao conectar com PostgreSQL"

1. Verifique se PostgreSQL está rodando:
   ```bash
   # Windows
   Get-Service postgresql-* | Start-Service
   ```

2. Verifique credenciais no `.env`

3. Tente conectar manualmente:
   ```bash
   psql -U postgres -h localhost
   ```

---

### "CORS error"

Certifique-se que `CORS_ORIGIN` no `.env` corresponde ao domínio do seu frontend

---

### "Token inválido"

- Token expirou? Faça login novamente
- JWT_SECRET mudou? Todos os tokens anteriores ficarão inválidos

---

## 📦 Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| express | 4.18.2 | Framework web |
| pg | 8.11.3 | Driver PostgreSQL |
| bcryptjs | 2.4.3 | Hash de senhas |
| jsonwebtoken | 9.1.2 | Tokens JWT |
| dotenv | 16.3.1 | Variáveis de ambiente |
| cors | 2.8.5 | CORS middleware |
| helmet | 7.1.0 | Headers de segurança |
| nodemon | 3.0.2 | Dev: Hot reload |

---

## 🚀 Deploy em Produção

### Antes de fazer deploy:

1. Altere `NODE_ENV` para `production`
2. Gere novas chaves JWT seguras
3. Use senhas fortes no banco de dados
4. Configure HTTPS/SSL
5. Ative rate limiting
6. Configure backups automáticos do banco
7. Use um serviço como Heroku, Railway, ou seu próprio servidor

---

## 📧 Suporte

Para problemas ou dúvidas, abra uma issue no repositório do GitHub.

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para a comunidade Pokémon da FATEC Registro**
