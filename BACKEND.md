# Backend

Este backend usa Express + MySQL para servir a aplicação tipo Steam e expor uma API REST para loja, biblioteca, carrinho, wishlist, social e mídia.

## Visão geral

- `backend/index.js` inicia o servidor.
- `backend/app.js` configura middlewares, arquivos estáticos e o router da API.
- `backend/config/db.js` cria o pool MySQL com `mysql2/promise`.
- `backend/models/` concentra as consultas SQL.
- `backend/services/` concentra a regra de negócio.
- `backend/controllers/` recebe a requisição e devolve a resposta.
- `backend/routes/apiRoutes.js` liga rotas aos controllers.
- `backend/media/` guarda imagens, banners, screenshots e outros arquivos de mídia locais.

## Base da API

Todas as rotas da API ficam abaixo de `/api`.

Exemplo:
- `GET /api/status`
- `GET /api/games`

## O que o backend retorna

### Status

`GET /api/status`

Retorna:
- `status`: sempre `ok`
- `time`: data e hora atual

Exemplo:
```json
{
  "status": "ok",
  "time": "2026-06-14T12:00:00.000Z"
}
```

### Jogos e catálogo

`GET /api/games`

Retorna a lista de jogos com dados da categoria e campos de mídia que vierem do banco, como:
- `id_jogo`
- `titulo`
- `descricao`
- `preco`
- `data_lancamento`
- `desenvolvedor`
- `distribuidora`
- `capa_url`
- `banner_url`
- `id_categoria`
- `nome_categoria`
- `categoria_descricao`

`GET /api/games/:id`

Retorna um jogo específico pelo `id`.

Se não existir, responde com `404` e:
```json
{ "error": "Jogo não encontrado" }
```

`GET /api/categories`

Retorna a lista de categorias com:
- `id_categoria`
- `nome_categoria`
- `descricao`

`GET /api/games/feed/home`

Retorna um feed para a home com:
- `destaques`
- `promocoes`
- `recomendados`
- `recentes`

Se a query `userId` for enviada, o backend usa isso para evitar recomendar jogos já comprados.

Exemplo:
`GET /api/games/feed/home?userId=1`

`GET /api/games/:gameId/details`

Retorna um pacote completo do jogo com:
- `game`
- `screenshots`
- `videos`
- `achievements`
- `reviews`

Esse endpoint serve para montar a página de detalhes do jogo no frontend.

`GET /api/games/:gameId/media`

Retorna apenas a mídia do jogo:
- `screenshots`
- `videos`

### Autenticação e usuários

`POST /api/register`

Pede no body:
- `nome`
- `email`
- `senha`

Retorna `201` com:
- `id_usuario`
- `nome`
- `email`

Se faltar campo, responde `400` com:
```json
{ "error": "Campos obrigatórios: nome, email, senha" }
```

Se o e-mail já existir, responde `400` com:
```json
{ "error": "Email já cadastrado" }
```

`POST /api/login`

Pede no body:
- `email`
- `senha`

Retorna:
- `id_usuario`
- `nome`
- `saldo_carteira`

Se a senha ou e-mail estiverem errados, responde `401` com:
```json
{ "error": "Credenciais inválidas" }
```

`GET /api/users/:userId/profile`

Retorna o perfil completo do usuário com os contadores:
- `total_jogos`
- `total_horas_jogadas`
- `total_conquistas`
- `total_amigos`
- `total_avaliacoes`

Além dos campos do usuário, como:
- `id_usuario`
- `nome`
- `email`
- `avatar_url`
- `saldo_carteira`
- `data_cadastro`

### Biblioteca

`POST /api/purchase`

Pede no body:
- `userId`
- `gameId`

O backend:
- confere se o usuário existe
- confere se o jogo existe
- verifica se o jogo já está na biblioteca
- valida se há saldo suficiente
- debita o saldo
- insere o jogo na `Biblioteca`
- registra uma atividade de compra

Retorna:
```json
{
  "success": true,
  "saldo_carteira": 123.45
}
```

Se falhar, responde `400` com um objeto `error`.

`GET /api/library/:userId`

Retorna os jogos do usuário na biblioteca, incluindo os dados do jogo e da aquisição:
- `data_aquisicao`
- `horas_jogadas`
- campos completos do jogo

### Carrinho

`GET /api/cart/:userId`

Retorna os itens do carrinho do usuário.

`POST /api/cart`

Pede no body:
- `userId`
- `gameId`

Adiciona o jogo ao carrinho.

Retorna:
```json
{ "success": true }
```

`DELETE /api/cart/:userId/:gameId`

Remove um item do carrinho.

Retorna:
```json
{ "success": true }
```

`POST /api/cart/:userId/checkout`

Finaliza a compra do carrinho inteiro.

O backend:
- soma o total
- confere saldo
- debita do usuário
- insere os jogos na biblioteca
- registra atividades
- limpa o carrinho

Retorna:
```json
{
  "success": true,
  "saldo_carteira": 99.9
}
```

Se não houver saldo suficiente, responde com erro.

### Wishlist

`GET /api/wishlist/:userId`

Retorna os jogos salvos na lista de desejos.

`POST /api/wishlist`

Pede no body:
- `userId`
- `gameId`

Adiciona o jogo na wishlist.

Retorna:
```json
{ "success": true }
```

`DELETE /api/wishlist/:userId/:gameId`

Remove o jogo da wishlist.

Retorna:
```json
{ "success": true }
```

### Social

`GET /api/users/:userId/achievements`

Retorna as conquistas desbloqueadas pelo usuário.

`GET /api/games/:gameId/achievements`

Retorna as conquistas disponíveis para um jogo.

`GET /api/users/:userId/friends`

Retorna a lista de amizades do usuário, com status:
- `pendente`
- `aceita`
- `bloqueada`

`GET /api/activity`

Retorna o feed de atividades com dados de usuário e jogo quando existir.

`GET /api/games/:gameId/reviews`

Retorna as avaliações de um jogo.

`POST /api/reviews`

Pede no body:
- `userId`
- `gameId`
- `nota`
- `comentario` opcional
- `recomendaria` opcional

Cria uma nova avaliação.

Retorna:
```json
{ "success": true, "id_avaliacao": 1 }
```

`POST /api/friends`

Pede no body:
- `userId`
- `friendId`

Cria uma solicitação de amizade.

Retorna:
```json
{ "id_amizade": 1 }
```

`PATCH /api/friends/:friendshipId`

Pede no body:
- `status_amizade`

Atualiza o status da amizade.

Exemplo de status:
- `pendente`
- `aceita`
- `bloqueada`

Retorna:
```json
{ "success": true }
```

`DELETE /api/friends/:friendshipId`

Remove a amizade.

Retorna:
```json
{ "success": true }
```

### Mídia local

As imagens ficam em `backend/media/` para não ocupar o banco.

O backend serve esses arquivos em:
- `/media/...`

Exemplos:
- `backend/media/jogos/capa1.jpg` vira `/media/jogos/capa1.jpg`
- `backend/media/jogos/banner1.jpg` vira `/media/jogos/banner1.jpg`

Os campos `capa_url`, `banner_url`, `avatar_url`, `icone_url`, `imagem_url` e alguns `video_url` podem apontar para esse diretório.

## Regras importantes

- O backend usa MySQL via `mysql2/promise`.
- As consultas ficam nos models.
- As regras de negócio ficam nos services.
- Os controllers só recebem a request e devolvem a response.
- As imagens devem ser salvas no diretório `backend/media/` e referenciadas por caminho relativo.

## Resumo do fluxo

1. O frontend chama uma rota da API.
2. O controller recebe os parâmetros.
3. O service aplica a regra de negócio.
4. O model executa a consulta SQL.
5. O banco retorna os dados.
6. O backend responde em JSON.
