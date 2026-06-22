# Stim - Frontend & Integração de Banco de Dados (Versão MPA)

O frontend do **Stim** (uma réplica fiel e moderna da loja de jogos Steam) foi desenvolvido como uma **Aplicação Multi-Páginas (MPA)** estruturada, modular e de alta performance utilizando **HTML5 semântico, Vanilla CSS3 e JavaScript ES6 (AJAX/Fetch)**.

A aplicação está integrada ao servidor Express local e comunica-se dinamicamente com o banco de dados MySQL rodando em container Docker.

---

## 🚀 Como Executar o Projeto

1. **Iniciar o Servidor Backend (já ativo em segundo plano):**
   ```bash
   npm run dev
   ```
   *O servidor Express roda em `http://localhost:3000` servindo os arquivos estáticos do frontend e a API REST em `/api`.*

2. **Acessar a Aplicação:**
   Abra seu navegador de preferência e acesse:
   👉 **[http://localhost:3000](http://localhost:3000)** (Redireciona para `index.html`)

---

## 📂 Estrutura do Projeto Frontend

O frontend está organizado de forma modular, onde cada página possui seu próprio escopo e script JS de integração:

*   **Páginas HTML (`frontend/`):**
    *   [index.html](file:///C:/Users/renan/programs/db-web2-project/frontend/index.html) -> Página principal da Loja.
    *   [game.html](file:///C:/Users/renan/programs/db-web2-project/frontend/game.html) -> Página de detalhes do produto.
    *   [library.html](file:///C:/Users/renan/programs/db-web2-project/frontend/library.html) -> Cliente de biblioteca de jogos (requer login).
    *   [community.html](file:///C:/Users/renan/programs/db-web2-project/frontend/community.html) -> Rede social de amigos e feed de atividades.
    *   [profile.html](file:///C:/Users/renan/programs/db-web2-project/frontend/profile.html) -> Dashboard de perfil e recarga de carteira (requer login).
    *   [cart.html](file:///C:/Users/renan/programs/db-web2-project/frontend/cart.html) -> Carrinho de compras do usuário (requer login).
    *   [wishlist.html](file:///C:/Users/renan/programs/db-web2-project/frontend/wishlist.html) -> Lista de desejos de jogos (requer login).
    *   [login.html](file:///C:/Users/renan/programs/db-web2-project/frontend/login.html) -> Tela unificada de login e cadastro.

*   **Scripts JavaScript (`frontend/js/`):**
    *   [common.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/common.js) -> Script compartilhado. Gerencia a sessão do usuário, atualiza a barra de navegação, sincroniza saldo e carrinho de compras em todas as páginas, monitora a conectividade com o backend e protege rotas autenticadas.
    *   [store.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/store.js) -> Controla carrosséis de destaques e filtros na página inicial.
    *   [game.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/game.js) -> Controla galeria de mídia e envios de análises na página do produto.
    *   [library.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/library.js) -> Gerencia a lista de jogos adquiridos e o simulador de jogo.
    *   [community.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/community.js) -> Alimenta o feed de atividades e gerencia as solicitações de amizade.
    *   [profile.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/profile.js) -> Renderiza estatísticas de jogo e modais de depósito de saldo.
    *   [cart.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/cart.js) -> Manipula adição, remoção e checkout do carrinho de compras.
    *   [wishlist.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/wishlist.js) -> Renderiza e atualiza a Lista de Desejos.
    *   [login.js](file:///C:/Users/renan/programs/db-web2-project/frontend/js/login.js) -> Realiza as validações e requisições de autenticação e registro.

---

## 🔗 Integração com as Rotas do Backend

Abaixo está o mapeamento das rotas do backend (`/api/*`) consumidas dinamicamente via AJAX:

| Categoria | Método | Rota da API | Função no Frontend |
| :--- | :---: | :--- | :--- |
| **Geral** | `GET` | `/status` | Monitoramento constante de conectividade do servidor (*Online/Offline*). |
| **Jogos & Loja** | `GET` | `/games` | Listagem geral de jogos na busca em tempo real. |
| **Jogos & Loja** | `GET` | `/categories` | Popula dinamicamente a barra de categorias na navegação superior. |
| **Jogos & Loja** | `GET` | `/games/feed/home` | Carrega os carrosséis de destaques e as seções da página inicial da loja. |
| **Jogos & Loja** | `GET` | `/games/:gameId/details` | Monta a página de detalhes do jogo, trazendo mídia, conquistas e reviews. |
| **Jogos & Loja** | `GET` | `/games/:gameId/media` | Exibe capturas de tela e trailers na galeria da loja. |
| **Autenticação** | `POST` | `/register` | Formulário de criação de conta no modal de cadastro. |
| **Autenticação** | `POST` | `/login` | Acesso do usuário por e-mail e senha. |
| **Biblioteca** | `POST` | `/purchase` | Compra direta de um jogo na página de detalhes. |
| **Biblioteca** | `GET` | `/library/:userId` | Carrega os jogos adquiridos pelo usuário logado na aba Biblioteca. |
| **Biblioteca** | `POST` | `/library/:userId/play/:gameId` | Executa o jogo, incrementando playtime e sorteando conquistas no banco. |
| **Perfil** | `GET` | `/users/:userId/profile` | Traz estatísticas agregadas e saldo atual da carteira. |
| **Perfil** | `POST` | `/users/:userId/deposit` | Adiciona créditos virtuais ao saldo do usuário. |
| **Carrinho** | `GET` | `/cart/:userId` | Lista os itens adicionados ao carrinho. |
| **Carrinho** | `POST` | `/cart` | Adiciona um jogo ao carrinho por meio dos cards ou da página de detalhes. |
| **Carrinho** | `DELETE` | `/cart/:userId/:gameId` | Remove um jogo do carrinho. |
| **Carrinho** | `POST` | `/cart/:userId/checkout` | Conclui a compra do carrinho, debitando saldo e inserindo os jogos na biblioteca. |
| **Desejos** | `GET` | `/wishlist/:userId` | Carrega a lista de desejos do usuário. |
| **Desejos** | `POST` | `/wishlist` | Adiciona ou remove jogo da lista de desejos (toggle). |
| **Desejos** | `DELETE` | `/wishlist/:userId/:gameId` | Remove um jogo da lista de desejos. |
| **Social / Feed** | `GET` | `/users/:userId/achievements` | Exibe as conquistas desbloqueadas do usuário no perfil e biblioteca. |
| **Social / Feed** | `GET` | `/games/:gameId/achievements` | Mostra as conquistas possíveis de um jogo na página de detalhes. |
| **Social / Feed** | `GET` | `/users/:userId/friends` | Lista a rede de amizades (pendentes ou aceitas). |
| **Social / Feed** | `GET` | `/activity` | Alimenta o feed de atividades da comunidade com compras, conquistas e reviews. |
| **Social / Feed** | `GET` | `/games/:gameId/reviews` | Lista as análises escritas por usuários no produto. |
| **Social / Feed** | `POST` | `/reviews` | Envia uma nota e comentário recomendando ou não o jogo. |
| **Social / Feed** | `POST` | `/friends` | Envia convite de amizade digitando o ID de outro usuário. |
| **Social / Feed** | `PATCH` | `/friends/:friendshipId` | Aceita ou bloqueia uma solicitação de amizade pendente. |
| **Social / Feed** | `DELETE` | `/friends/:friendshipId` | Rejeita, cancela ou remove uma amizade da rede. |

---

## 🎨 Identidade Visual (Design System)

A paleta de cores e estilo visual do **Stim** baseia-se fielmente nos elementos icônicos da interface do Steam Web e do cliente de desktop:

*   **Paleta de Cores:**
    *   Fundo principal (Corpo): `#1b2838` (Azul petróleo escuro de fundo) transicionando para `#080d16` (Deep black/blue).
    *   Painéis e Cards: `#162030` com transições suaves no hover para `#1f2e43`.
    *   Texto de Destaque / Links: `#66c0f4` (Azul claro vibrante do Steam).
    *   Botões de Compra: Gradiente verde do Steam (`#75b022` a `#588a1b`).
    *   Botões de Ação Secundária: Azul marinho fosco (`#2a3f5a`) e bordas suaves.
*   **Efeitos Visuais:**
    *   Vidro e sombras espessas (`box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4)`) em modais e carrosséis.
    *   Barra de rolagem personalizada em tons escuros e com destaque azul ao interagir.
    *   Micro-animações de elevação no hover de cards de jogos.
    *   Filtro borrado e sobreposição de gradientes em modais de login e registro.
