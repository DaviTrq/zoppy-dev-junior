# CRUD Clientes e Produtos: Desafio Zoppy

Aplicacao crud feita para o desafio da zoppy. Possui cliente e produto com relacionamento.

## O que se encontra na aplicação

- Backend NestJs 10 + Mysql
- Frontend Angular 19  
- Docker para tudo
- Crud completo
- Busca e paginação
- Testes unitários

## Como executar o projeto

### 1. Clone o repositório
```bash
git clone [url-do-meu-repo]
cd zoppy-desenvolvedor-jr
```

### 2. Backend
```bash
cd backend
npm install
docker-compose up -d
# espera o mysql subir
npm run start:dev
```

- Backend vai estar em http://localhost:3000
- Documentação do swagger em http://localhost:3000/api

### 3. frontend
```bash
cd frontend  
npm install
npm start
```

- Frontend vai estar em http://localhost:4200

## Caso venha a dar erro

- 1. Provavel que seja por causa do docker

    ## baixando docker desktop

    - Abra seu navegador
    - Navegue até: https://www.docker.com/products/docker-desktop/
    - Clique "Download for Windows"
    - Aguarde o download do arquivo `Docker Desktop Installer.exe`
    - Execute o arquivo baixado e siga a instalação. Após completar repita os passos do readme inteiro novamente


- 2. Se o Mysql nao subir: `docker-compose down` e `docker-compose up -d` de novo
- 3. Se der erro de porta: parar os processos nas portas 3000 e 4200, Ctrl+C no terminal onde está rodando.

## Para testar

```bash
cd backend
npm test
npm run test:cov
```

## Stacks

- nestjs 10
- angular 19
- mysql 8
- docker
- sequelize
- tailwindcss
- jest

## Aprendizado e Evolução Técnica

Este projeto foi muito importante para a minha evolução técnica. Com ele, consegui aprofundar bastante meus conhecimentos em NestJS, trabalhando com arquitetura em camadas, relacionamentos entre entidades, testes unitários e boas práticas na construção de APIs REST. No Angular, evoluí na criação de CRUDs completos, integração com o backend, implementação de busca, paginação e melhor organização dos componentes.

Também passei a ter mais segurança no uso de Docker para padronizar o ambiente de desenvolvimento, além de reforçar conceitos de MySQL, Sequelize, Jest e TailwindCSS. No geral, o desafio me ajudou a desenvolver uma visão mais madura de aplicações full stack, mais organizadas, testáveis e próximas do que é usado em projetos reais.

Espero que gostem!!!

Atenciosamente, 

Davi Torquato.

