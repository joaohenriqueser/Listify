# Projeto To-Do List (Gestão de Tarefas)

Bem-vindo ao projeto To-Do List! Este é um aplicativo web completo (Full Stack) construído com Laravel e React, projetado para ajudar usuários a organizar suas tarefas diárias de forma eficiente e moderna.

O sistema permite que os usuários se registrem, gerenciem suas tarefas através de uma interface limpa (CRUD completo) e também consultem a previsão do tempo atual para planejar seu dia.

---

## Funcionalidades Principais

* **Autenticação de Usuários:** Sistema completo de registro e login usando Laravel Fortify/Sanctum. As rotas são protegidas, exigindo que o usuário esteja autenticado para acessar o painel.
* **Gerenciamento de Tarefas (CRUD):**
    * **Criar:** Formulário intuitivo para adicionar novas tarefas.
    * **Listar:** Visualização de todas as tarefas pendentes ou concluídas do usuário logado.
    * **Editar:** Interface em Dialog (modal) para atualizar tarefas existentes.
    * **Excluir:** Opção de remover tarefas.
* **Filtros Dinâmicos:** A lista de tarefas pode ser filtrada instantaneamente por **Status** (Pendente, Em Andamento, Concluída) ou por **Prazo (Data)**.
* **Integração com API Externa:** Um widget no dashboard consome a API **OpenWeatherMap**, permitindo ao usuário buscar a previsão do tempo atual para qualquer cidade.
* **Interface Responsiva:** Construído com **TailwindCSS** e componentes `ui` (baseados em Shadcn/Radix), garantindo uma experiência de usuário limpa e moderna em desktops e dispositivos móveis.

---

## Tecnologias Utilizadas

Este projeto combina o poder do Laravel no backend com a reatividade do React no frontend.

* **Backend:**
    * PHP 8.4+
    * Laravel 11+
    * MySQL
    * Laravel Fortify/Sanctum (Autenticação de Sessão para SPA)
* **Frontend:**
    * JavaScript (ES6+) / TypeScript (TSX):** Linguagem principal do frontend.
    * React: Biblioteca principal para a construção da interface de usuário (UI).
    * Inertia.js (Conecta Laravel e React)
    * Vite (Compilador de assets)
    * TailwindCSS (Design e UI)
* **Ferramentas Adicionais:**
    * Ziggy (Para uso de rotas nomeadas do Laravel no React)
    * Axios (Para requisições de API de clima)

---

## Instalação e Execução Local

Siga os passos abaixo para rodar o projeto na sua máquina local.

**Pré-requisitos:**
* PHP (v8.2+)
* Composer
* Node.js & npm
* Servidor MySQL (Laragon, XAMPP, etc.)

**Passos:**

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/joaohenriqueser/projeto-todo-list]
    cd toDoList
    ```

2.  **Instalar dependências do Backend (PHP):**
    ```bash
    composer install
    ```

3.  **Configurar Ambiente (.env):**
    * Copie o arquivo de exemplo:
        ```bash
        cp .env.example .env
        ```
    * Gere a chave da aplicação:
        ```bash
        php artisan key:generate
        ```
    * Abra o arquivo `.env` e configure seu banco de dados MySQL:
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_DATABASE=toDoList
        DB_USERNAME=root
        DB_PASSWORD=
        ```
    * **IMPORTANTE:** Adicione sua chave da API OpenWeatherMap:
        ```env
        OPENWEATHER_API_KEY="SUA_CHAVE_API_VAI_AQUI"
        ```

4.  **Rodar as Migrações (Criar tabelas):**
    * Certifique-se de que o banco `toDoList` foi criado no seu MySQL.
    * Rode o comando:
        ```bash
        php artisan migrate:fresh
        ```

5.  **Instalar dependências do Frontend (JavaScript):**
    ```bash
    npm install
    ```

6.  **Gerar o mapa de rotas (Ziggy):**
    * (Se o Ziggy não estiver instalado, rode `composer require tightenco/ziggy` primeiro).
    ```bash
    php artisan ziggy:generate
    ```

7.  **Iniciar os Servidores (em dois terminais separados):**

    * **Terminal 1 (Backend):**
        ```bash
        php artisan serve
        ```
    * **Terminal 2 (Frontend):**
        ```bash
        npm run dev
        ```

8.  **Acessar a Aplicação:**
    * Abra seu navegador em: `http://localhost:8000`