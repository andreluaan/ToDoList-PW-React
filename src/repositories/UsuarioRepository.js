const { IUsuarioRepository } = require('./IUsuarioRepository');
const { Usuario } = require('../models/Usuario');
const db = require('../database/db');

class UsuarioRepository extends IUsuarioRepository {
  constructor() {
    super();
    this.db = db;
  }

  criar(usuario) {
    const info = this.db
      .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
      .run(usuario.nome, usuario.email, usuario.senhaHash);

    return Number(info.lastInsertRowid);
  }

  buscarPorEmail(email) {
    const row = this.db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    return row ? this._paraEntidade(row) : null;
  }

  buscarPorId(id) {
    const row = this.db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
    return row ? this._paraEntidade(row) : null;
  }

  _paraEntidade(row) {
    return new Usuario({
      id: row.id,
      nome: row.nome,
      email: row.email,
      senhaHash: row.senha_hash,
    });
  }
}

module.exports = { UsuarioRepository };