-- =========================================
-- USUÁRIOS
-- =========================================

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    saldo_carteira DECIMAL(10,2) DEFAULT 0.00,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CATEGORIAS
-- =========================================

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT
);

-- =========================================
-- JOGOS
-- =========================================

CREATE TABLE Jogos (
    id_jogo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    data_lancamento DATE,

    desenvolvedor VARCHAR(150),
    distribuidora VARCHAR(150),

    capa_url VARCHAR(500),
    banner_url VARCHAR(500),

    id_categoria INT NOT NULL,

    CONSTRAINT fk_jogo_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES Categorias(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================================
-- SCREENSHOTS DOS JOGOS
-- =========================================

CREATE TABLE Screenshots_Jogos (
    id_screenshot INT AUTO_INCREMENT PRIMARY KEY,
    id_jogo INT NOT NULL,
    imagem_url VARCHAR(500) NOT NULL,
    ordem INT DEFAULT 1,

    CONSTRAINT fk_screenshot_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- VÍDEOS DOS JOGOS
-- =========================================

CREATE TABLE Videos_Jogos (
    id_video INT AUTO_INCREMENT PRIMARY KEY,
    id_jogo INT NOT NULL,
    video_url VARCHAR(500) NOT NULL,

    CONSTRAINT fk_video_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- BIBLIOTECA DOS USUÁRIOS
-- =========================================

CREATE TABLE Biblioteca (
    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,
    data_aquisicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    horas_jogadas DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (id_usuario, id_jogo),

    CONSTRAINT fk_biblioteca_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_biblioteca_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- CONQUISTAS
-- =========================================

CREATE TABLE Conquistas (
    id_conquista INT AUTO_INCREMENT PRIMARY KEY,
    id_jogo INT NOT NULL,
    nome_conquista VARCHAR(120) NOT NULL,
    descricao TEXT,
    pontos INT NOT NULL DEFAULT 0,
    icone_url VARCHAR(500),
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conquista_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- CONQUISTAS DOS USUÁRIOS
-- =========================================

CREATE TABLE Usuario_Conquistas (
    id_usuario INT NOT NULL,
    id_conquista INT NOT NULL,
    data_desbloqueio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_conquista),

    CONSTRAINT fk_usuario_conquista_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_usuario_conquista_conquista
        FOREIGN KEY (id_conquista)
        REFERENCES Conquistas(id_conquista)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- AMIGOS
-- =========================================

CREATE TABLE Amigos (
    id_amizade INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_amigo INT NOT NULL,

    status_amizade ENUM(
        'pendente',
        'aceita',
        'bloqueada'
    ) NOT NULL DEFAULT 'pendente',

    data_solicitacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aceite DATETIME NULL,

    CONSTRAINT fk_amigos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_amigos_amigo
        FOREIGN KEY (id_amigo)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_amizade
        UNIQUE (id_usuario, id_amigo)
);

-- =========================================
-- ATIVIDADES
-- =========================================

CREATE TABLE Atividades (
    id_atividade INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_jogo INT NULL,

    tipo_atividade VARCHAR(50) NOT NULL,

    descricao TEXT NOT NULL,

    visibilidade ENUM(
        'publica',
        'amigos',
        'privada'
    ) NOT NULL DEFAULT 'publica',

    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_atividade_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_atividade_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================================
-- AVALIAÇÕES
-- =========================================

CREATE TABLE Avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,

    nota TINYINT NOT NULL,
    comentario TEXT,

    recomendaria BOOLEAN NOT NULL DEFAULT TRUE,

    data_avaliacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_avaliacao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_avaliacao_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_avaliacao_usuario_jogo
        UNIQUE (id_usuario, id_jogo)
);

-- =========================================
-- CARRINHO DE COMPRAS
-- =========================================

CREATE TABLE Carrinho (
    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,
    data_adicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_jogo),

    CONSTRAINT fk_carrinho_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_carrinho_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================================
-- WISHLIST
-- =========================================

CREATE TABLE Wishlist (
    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,
    data_adicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_jogo),

    CONSTRAINT fk_wishlist_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_wishlist_jogo
        FOREIGN KEY (id_jogo)
        REFERENCES Jogos(id_jogo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);