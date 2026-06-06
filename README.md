# Fleet Management API

Esta é uma API robusta desenvolvida com **NestJS**, projetada para o gerenciamento completo de frotas de veículos e controle de recursos associados. O sistema integra diversas tecnologias modernas para garantir escalabilidade, segurança e auditabilidade.

---

## 🚀 Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Bancos de Dados:**
  - **SQL Server (MSSQL):** Armazenamento principal de usuários, veículos e registros financeiros (TypeORM).
  - **MongoDB:** Logs de auditoria para rastreabilidade de ações (Mongoose).
- **Mensageria:** [RabbitMQ](https://www.rabbitmq.com/) para processamento assíncrono de operações.
- **Cache:** [Redis](https://redis.io/) para otimização de consultas de veículos.
- **Segurança:** Autenticação baseada em JWT e hash de senhas com `bcryptjs`.
- **Logs:** [Pino](https://getpino.io/) para logging de alta performance.
- **Documentação:** [Swagger](https://swagger.io/) para interface interativa da API.
- **Containerização:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/).

---

## ✨ Funcionalidades Principais

### 🚗 Módulo de Frota
- **Marcas e Modelos:** Gerenciamento completo (CRUD) de marcas e modelos de veículos.
- **Veículos:** Registro e controle de frota com validação de placa, chassi e Renavam.
- **Cache Inteligente:** Listagem de veículos otimizada com Redis.

### 👥 Gestão de Contas e Recursos
- **Contas:** Criação, atualização, listagem e exclusão de perfis de acesso.
- **Transações e Créditos:** Sistema de créditos e transferências internas para controle de custos ou recursos.
- **Saldo:** Consulta de saldo de recursos em tempo real.
- **Reembolsos:** Sistema de estorno para operações dentro de um prazo limite (1 dia).
- **Processamento Assíncrono:** Uso de filas (RabbitMQ) para garantir a integridade das operações.

### 🔍 Auditoria e Logs
- **Audit Logs:** Todas as ações críticas (Criação, Edição, Deleção) em Marcas, Modelos e Veículos são registradas automaticamente no MongoDB.
- **Logger:** Middleware de log para monitoramento de todas as requisições HTTP.

---

## 🛠️ Configuração Inicial

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **Docker** & **Docker Compose**

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Database (SQL Server)
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_NAME=fleetapi_db

# MongoDB
MONGO_URI=mongodb://localhost:27017/fleet_audit

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBIT_PREFETCH=10

# Security
SECRET_KEY="sua_chave_secreta_aqui"
```

### 2. Subindo a Infraestrutura (Docker)
Para rodar os serviços necessários:

```bash
docker compose up -d
```

### 3. Rodando a Aplicação
Instale as dependências e inicie o servidor:

```bash
npm install
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

---

## 📖 Documentação (Swagger)

Acesse a documentação interativa em:

👉 [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🧪 Testes

```bash
npm run test
npm run test:e2e
```

---

## 🔑 Usuário Padrão (Seed)
- **Email:** `aivacol@aivacol.com`
- **Senha:** `AivacolStrong!Password123`
