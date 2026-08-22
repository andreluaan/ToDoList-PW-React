# Feito. — To-Do List (Unidade 2: Autenticação + React + Listas)

Aplicação de lista de tarefas full stack, com autenticação JWT, persistência em SQLite (SQL puro) e front-end em React. Projeto acadêmico aplicando **POO**, **SOLID** (com ênfase em SRP e DIP) e uma arquitetura em camadas.

> Esse repositório é a continuação da Unidade 1 (CRUD + front-end básico em HTML/CSS/Bootstrap, ainda disponível em `public/`). A Unidade 2 adiciona login, múltiplas listas por usuário e um front-end novo em React.

## ✨ Funcionalidades

- **Autenticação**: registro e login com senha criptografada (`bcryptjs`) e sessão via JWT.
- **Multiusuário**: cada pessoa só enxerga e mexe nas próprias listas e tarefas.
- **Listas de tarefas**: o usuário pode criar quantas listas quiser (ex: "Afazeres diários", "O que assistir").
- **Reset diário opcional**: cada lista pode ser marcada para resetar as tarefas concluídas todo dia — outras listas não são afetadas.
- **Categorias**: dentro de cada lista, tarefas podem ser agrupadas por uma etiqueta livre (categoria).
- **CRUD completo de tarefas**: criar, listar, editar, concluir/reabrir e excluir.
- **Front-end em React** (login, registro, tela de tarefas) e um front-end mais simples em HTML/CSS/Bootstrap (Unidade 1), ambos consumindo a mesma API.

## 🧱 Arquitetura

O back-end segue camadas bem separadas, repetidas para cada entidade (`Usuario`, `Lista`, `Tarefa`):

```
routes → controllers → services → repositories → models
```

- **Model**: entidade com atributos privados e regras próprias (ex: `Tarefa.concluir()`).
- **Repository**: uma interface (`ITarefaRepository`, `IListaRepository`, `IUsuarioRepository`) e uma implementação em SQL puro. O `service` depende só da interface — **DIP** na prática.
- **Service**: regra de negócio, não sabe como os dados são persistidos.
- **Controller**: só traduz requisição HTTP ↔ chamada ao service.

### Reset diário — como funciona

Em vez de depender de um `cron` rodando exatamente à meia-noite (o que exigiria o servidor no ar 24/7), o reset é **preguiçoso**: toda vez que as listas do usuário são carregadas (`GET /listas`), o repositório verifica se alguma lista com `resetarDiariamente = true` não é resetada desde antes de hoje. Se for o caso, as tarefas concluídas dela voltam para `pendente` ali mesmo. Isso funciona mesmo que o servidor tenha ficado desligado à meia-noite.

## 🗄️ Modelagem do banco (SQLite)

| Tabela | Chave primária | Relações |
|---|---|---|
| `usuarios` | `id` | — |
| `listas` | `id` | `usuario_id` → `usuarios.id` |
| `categorias` | `id` | — |
| `tarefas` | `id` (UUID) | `usuario_id` → `usuarios.id`, `lista_id` → `listas.id`, `categoria_id` → `categorias.id` |

Schema completo em [`db/schema.sql`](db/schema.sql). Detalhes de SRP/DIP da modelagem original em [`docs/modelagem.md`](docs/modelagem.md).

## 🛠️ Stack

- **Back-end**: Node.js, Express, SQL puro via `node:sqlite` (nativo do Node, sem dependência externa), `jsonwebtoken`, `bcryptjs`, `cors`.
- **Front-end (Unidade 2)**: React + Vite, React Router.
- **Front-end (Unidade 1)**: HTML, CSS, Bootstrap, JavaScript puro.

## 📁 Estrutura de pastas

```
├── db/schema.sql              → schema SQL (tabelas, PK, FK)
├── data/                      → banco SQLite gerado localmente (gitignored)
├── public/                    → front-end da Unidade 1 (vanilla JS)
├── frontend-react/            → front-end da Unidade 2 (React + Vite)
│   └── src/
│       ├── api/               → cliente HTTP (fetch + token)
│       ├── context/           → AuthContext (estado de login)
│       ├── components/        → componentes reutilizáveis (modais, rota protegida)
│       └── pages/              → Login, Registro, Tarefas
└── src/                        → back-end
    ├── models/                 → Usuario, ListaDeTarefas, Tarefa
    ├── repositories/           → interfaces (I*) + implementações SQL
    ├── services/                → regra de negócio
    ├── controllers/             → camada HTTP
    ├── middlewares/             → autenticação (JWT)
    └── routes/                  → definição das rotas
```

## 🚀 Como rodar

### 1. Back-end

```bash
npm install
npm run dev
```

Sobe em `http://localhost:3000`. O banco SQLite é criado automaticamente na primeira execução (`data/todolist.sqlite`).

### 2. Front-end React

Em outro terminal:

```bash
cd frontend-react
npm install
cp .env.example .env
npm run dev
```

Sobe em `http://localhost:5173`, já configurado para falar com a API em `localhost:3000` (CORS liberado no back-end).

### 3. Front-end da Unidade 1 (opcional)

Já é servido automaticamente pelo próprio back-end em `http://localhost:3000/` (arquivos estáticos em `public/`).

## 🔌 Principais endpoints da API

Todas as rotas de `/listas` e `/tarefas` exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/registrar` | Cria um usuário e retorna o token |
| POST | `/auth/login` | Autentica e retorna o token |
| GET | `/listas` | Lista as listas do usuário (dispara o reset diário, se necessário) |
| POST | `/listas` | Cria uma lista (`nome`, `resetarDiariamente`) |
| PUT | `/listas/:id` | Renomeia ou altera o reset de uma lista |
| DELETE | `/listas/:id` | Remove uma lista (e as tarefas dela, em cascata) |
| GET | `/tarefas?listaId=` | Lista as tarefas de uma lista |
| POST | `/tarefas` | Cria uma tarefa (`titulo`, `descricao`, `categoria`, `listaId`) |
| PUT | `/tarefas/:id` | Atualiza uma tarefa |
| PATCH | `/tarefas/:id/concluir` | Marca como concluída |
| PATCH | `/tarefas/:id/reabrir` | Volta para pendente |
| DELETE | `/tarefas/:id` | Remove uma tarefa |

## 🧪 Testando a API

Coleção do Postman em [`ToDoList-PW.postman_collection.json`](ToDoList-PW.postman_collection.json) (cobre a Unidade 1; os endpoints de auth/listas podem ser testados manualmente seguindo a tabela acima).

## 📌 Notas

- O e-mail é normalizado (minúsculo, sem espaços) no cadastro/login; a senha continua sensível a maiúsculas/minúsculas.
- O front-end da Unidade 1 (`public/`) permanece no repositório como entrega anterior, mas não foi atualizado para autenticação — ele conversa com a API antiga (sem token).