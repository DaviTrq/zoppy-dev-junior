# CRUD Clientes e Produtos - Zoppy

> **Aplicação Full Stack desenvolvida para o desafio técnico da Zoppy**  
> Sistema completo de gerenciamento de clientes e produtos com relacionamentos

## Sobre o Projeto

Este projeto implementa um **CRUD completo** para gerenciamento de clientes e produtos, desenvolvido com as mais modernas stacks.

### 📄 Funcionalidades Principais

-  **CRUD Completo** - Create, Read, Update, Delete
-  **Busca Avançada** - Filtros inteligentes com debounce
-  **Paginação** - Navegação eficiente entre registros
-  **Relacionamentos** - Produtos vinculados a clientes
-  **Design Responsivo** - Mobile-first com Tailwind CSS
-  **Segurança** - Rate limiting e validações robustas
-  **Testes** - Cobertura de +50% com Jest
-  **Documentação** - Swagger/OpenAPI integrado

## Stacks

### Backend
- **NestJS 10** - Framework Node.js robusto
- **PostgreSQL 15** - Banco de dados relacional
- **Sequelize** - ORM para TypeScript
- **Docker** - Containerização
- **Jest** - Testes unitários
- **Swagger** - Documentação da API

### Frontend
- **Angular 19** - Framework SPA moderno
- **RxJS** - Programação reativa
- **TailwindCSS** - Estilização utilitária
- **TypeScript** - Tipagem estática
- **Responsive Design** - Mobile-first

## 📄 Como Executar

### Pré-requisitos
- **Node.js** 18+ 
- **Docker Desktop (Abra antes de rodar todos os passos)**
- **Git**

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/DaviTrq/zoppy-desenvolvedor-junior.git
cd zoppy-desenvolvedor-junior
```

### 2️⃣ Inicie o Banco de Dados
```bash
# Suba o PostgreSQL com Docker
docker-compose up -d

# Aguarde ~30s para inicialização completa
docker-compose logs postgres
```

### 3️⃣ Configure o Backend
```bash
cd backend
npm install
npm run start:dev
```

**Backend disponível em:** http://localhost:3000  
**Documentação Swagger:** http://localhost:3000/api

### 4️⃣ Configure o Frontend
```bash
cd ../frontend
npm install
npm start
```

**Frontend disponível em:** http://localhost:4200

##  Executar Testes

```bash
# Testes unitários
cd backend
npm test

# Cobertura de código
npm run test:cov
```

## 📁 Estrutura do Projeto

```
zoppy-desenvolvedor-junior/
├──  backend/              # API NestJS
│   ├── src/
│   │   ├── controllers/     # Endpoints REST
│   │   ├── services/        # Lógica de negócio
│   │   ├── entities/        # Models do banco
│   │   ├── dto/            # Validação de dados
│   │   └── middleware/     # Rate limiting
│   └── test/               # Testes unitários
├──  frontend/             # SPA Angular
│   └── src/app/
│       ├── pages/          # Componentes de tela
│       ├── services/       # Comunicação com API
│       └── models/         # Interfaces TypeScript
├──  docker-compose.yml    # Configuração PostgreSQL
└──  README.md            # Este arquivo
```

##  Design System

### Cores Zoppy (Com base no site)
- **Primário:** `#7b3dff` (Roxo Zoppy)
- **Texto:** `#002E73` (Azul Escuro)
- **Fonte:** `Inter, sans-serif`

### Componentes
- **Cards Responsivos** - Mobile e Desktop
- **Tabelas Inteligentes** - Ordenação e filtros
- **Formulários Validados** - Feedback em tempo real
- **Paginação Avançada** - Navegação otimizada

##  Segurança e Performance

### Limitações Implementadas
- **Rate Limiting:** 1000 req/15min (geral), 100 req/15min (busca)
- **Paginação:** Máximo 100 itens por página
- **Validação:** Sanitização contra SQL injection
- **Filtros:** Busca mínima de 2 caracteres

### Otimizações
- **Debounce** na busca (300ms)
- **Lazy Loading** de dados
- **Cache** com BehaviorSubject
- **Memory Leak Prevention** (takeUntil)

##  Cobertura de Testes

- **Branches:** 50%+
- **Functions:** 50%+
- **Lines:** 50%+
- **Statements:** 50%+

## Solução de Problemas

### PostgreSQL não inicia
```bash
docker-compose down
docker-compose up -d
```

### Erro de porta ocupada
```bash
# Parar processos nas portas 3000 e 4200
Ctrl+C nos terminais
```

### Dependências desatualizadas
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

## Desenvolvedor

**Davi Torquato**  
- Email: [davitrqto@gmail.com]
- GitHub: [DaviTrq](https://github.com/DaviTrq)
- LinkedIn: [Davi Torquato](https://www.linkedin.com/in/davi-torquato/)

---

### Aprendizados e Evolução

Este projeto foi fundamental para minha evolução técnica, permitindo aprofundar conhecimentos em:

- **Arquitetura em camadas** com NestJS
- **Relacionamentos** entre entidades
- **Testes unitários** e boas práticas
- **APIs REST** robustas e documentadas
- **SPAs modernas** com Angular 19
- **Programação reativa** com RxJS
- **Design responsivo** e UX
- **Containerização** com Docker
- **Segurança** e performance

O desafio me proporcionou uma visão mais madura de aplicações full stack, organizadas, testáveis e próximas do que é usado em projetos reais.

---

**Espero que gostem!!!**


Atenciosamente,  
Davi Torquato
