# Teste Prático - Desenvolvedor PHP (To-Do List)

Este projeto é uma solução completa para o teste prático de Desenvolvedor PHP, focado na criação de um sistema de gestão de tarefas ("To-Do List") utilizando um stack moderno com Laravel e React.

O sistema permite o cadastro de usuários, login/logout, gerenciamento completo de tarefas (CRUD), filtros dinâmicos e integração com uma API de previsão do tempo (OpenWeatherMap).

**Link para o Projeto Publicado:** `[INSERIR SEU LINK DO VERCEL OU RAILWAY AQUI]`

---

## Funcionalidades Implementadas

O projeto atende a todos os requisitos obrigatórios e inclui diferenciais:

* **Autenticação (Requisito 1):**
    * Cadastro de novos usuários (Nome, E-mail, Senha).
    * Login de usuários existentes.
    * Logout (no menu dropdown do usuário).
    * Proteção de rotas (só é possível acessar o Dashboard após o login).
    * Páginas de "Esqueci minha Senha" e "Resetar Senha" (via e-mail no log).
* **Gerenciamento de Tarefas (Requisito 2):**
    * **Criar:** Formulário para adicionar novas tarefas.
    * **Listar:** Lista de tarefas do usuário logado.
    * **Editar:** Abertura de um Dialog (Modal) para edição da tarefa.
    * **Excluir:** Botão de exclusão com confirmação.
* **Filtros Dinâmicos (Requisito 2):**
    * Filtragem da lista de tarefas por Status (Pendente, Em Andamento, Concluída).
    * Filtragem da lista de tarefas por Prazo (Data).
* **Lógica de Exibição (Customizada):**
    * Se uma tarefa está "Concluída", o prazo é substituído pela data em que foi concluída.
* **Consumo de API Externa (Requisito 3):**
    * Widget de Previsão do Tempo que busca dados da API **OpenWeatherMap** com base no nome da cidade digitado pelo usuário.
* **Interface (Requisito 4):**
    * Interface moderna e responsiva construída com **React**, **Inertia.js** e **TailwindCSS** (usando componentes `ui` baseados em Shadcn/Radix).

---

## Tecnologias Utilizadas (Stack)

Este projeto utiliza um stack moderno para alta performance e organização de código.

* **Backend:**
    * PHP 8.2+
    * Laravel 11+
    * Fortify/Sanctum (Para autenticação de sessão)
    * MySQL
* **Frontend:**
    * React (com TypeScript / TSX)
    * Inertia.js (A "cola" entre o Laravel e o React)
    * Vite (Compilador de frontend)
    * TailwindCSS (Estilização)
* **Outras Ferramentas:**
    * Ziggy (Para uso de rotas nomeadas do Laravel no JavaScript)
    * Axios (Para chamadas de API de Clima)

---

## Instalação e Execução Local

Siga os passos abaixo para rodar o projeto na sua máquina local.

**Pré-requisitos:**
* PHP 8.2+
* Composer
* Node.js (npm)
* Servidor MySQL (Laragon, XAMPP, etc.)

**Passos:**

1.  **Clonar o repositório:**
    ```bash
    git clone [SEU LINK DO GITHUB AQUI]
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
    * Abra o arquivo `.env` e configure seu banco de dados:
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
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