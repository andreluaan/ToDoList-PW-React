-- Schema do banco de dados do To-Do List (SQLite)
-- Quatro entidades: usuarios, listas, categorias e tarefas.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listas (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome                 TEXT NOT NULL,
  usuario_id           INTEGER NOT NULL,
  resetar_diariamente  INTEGER NOT NULL DEFAULT 0 CHECK (resetar_diariamente IN (0, 1)),
  ultimo_reset         TEXT NOT NULL DEFAULT (date('now')),
  criado_em            TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
  id           TEXT PRIMARY KEY,                 -- UUID gerado pela aplicação
  titulo       TEXT NOT NULL,
  descricao    TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida')),
  categoria_id INTEGER,                           -- etiqueta opcional dentro da lista
  lista_id     INTEGER NOT NULL,                  -- lista a que pertence
  usuario_id   INTEGER NOT NULL,                  -- dona da tarefa
  criado_em    TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  FOREIGN KEY (lista_id) REFERENCES listas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tarefas_categoria_id ON tarefas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_lista_id ON tarefas(lista_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_id ON tarefas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_listas_usuario_id ON listas(usuario_id);