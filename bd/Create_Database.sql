CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo_carteira DECIMAL(10, 2) DEFAULT 0.00 CHECK (saldo_carteira >= 0),
    data_cadastro DATE NOT NULL
);

-- 2. Tabela Categorias
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT
);

-- 3. Tabela Jogos
CREATE TABLE Jogos (
    id_jogo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    data_lancamento DATE,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_jogo_categoria FOREIGN KEY (id_categoria) 
        REFERENCES Categorias(id_categoria) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- 4. Tabela Biblioteca (Tabela Associativa N:N)
CREATE TABLE Biblioteca (
    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,
    data_aquisicao DATE NOT NULL,
    PRIMARY KEY (id_usuario, id_jogo),
    CONSTRAINT fk_biblioteca_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_biblioteca_jogo FOREIGN KEY (id_jogo) 
        REFERENCES Jogos(id_jogo) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);