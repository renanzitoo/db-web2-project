# Projeto BD - Base inicial

Base inicial com backend em `express` e frontend estático usando `Bootstrap` e `fetch` (AJAX).

Como executar

1. Instalar dependências:

```bash
npm install
```

2. Rodar servidor Express (serve frontend e API):

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3000` por padrão.

Endpoints de exemplo

- `GET /api/items` - lista de itens
- `POST /api/items` - adiciona item: JSON { "name": "Texto" }
- `GET /api/status` - retorna status

Frontend

O frontend está em `frontend/` e é servido automaticamente pelo Express. O arquivo principal é `frontend/index.html`.
