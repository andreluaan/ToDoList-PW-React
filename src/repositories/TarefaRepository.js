const { ITarefaRepository } = require('./ITarefaRepository');
const { Tarefa } = require('../models/Tarefa');
const db = require('../database/db');
const { CategoriaRepository } = require('./CategoriaRepository');

class TarefaRepository extends ITarefaRepository {
  constructor() {
    super();
    this.db = db;
    this.categoriaRepository = new CategoriaRepository(db);
  }

  inserir(tarefa, usuarioId, listaId) {
    const dto = tarefa.toJSON();
    const categoriaId = dto.categoria ? this.categoriaRepository.buscarOuCriar(dto.categoria) : null;

    this.db.prepare(`
      INSERT INTO tarefas (id, titulo, descricao, status, categoria_id, lista_id, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(dto.id, dto.titulo, dto.descricao, dto.status, categoriaId, listaId, usuarioId);

    return dto.id;
  }

  atualizar(tarefa, usuarioId) {
    const dto = tarefa.toJSON();
    const categoriaId = dto.categoria ? this.categoriaRepository.buscarOuCriar(dto.categoria) : null;

    this.db.prepare(`
      UPDATE tarefas SET titulo = ?, descricao = ?, status = ?, categoria_id = ?
      WHERE id = ? AND usuario_id = ?
    `).run(dto.titulo, dto.descricao, dto.status, categoriaId, dto.id, usuarioId);
  }

  buscarPorId(id, usuarioId) {
    const row = this.db.prepare(`
      SELECT t.id, t.titulo, t.descricao, t.status, c.nome AS categoria
      FROM tarefas t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE t.id = ? AND t.usuario_id = ?
    `).get(id, usuarioId);

    return row ? this._paraEntidade(row) : null;
  }

  listar(usuarioId, listaId) {
    const rows = this.db.prepare(`
      SELECT t.id, t.titulo, t.descricao, t.status, c.nome AS categoria
      FROM tarefas t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE t.usuario_id = ? AND t.lista_id = ?
      ORDER BY t.criado_em
    `).all(usuarioId, listaId);

    return rows.map((row) => this._paraEntidade(row));
  }

  remover(id, usuarioId) {
    const info = this.db.prepare('DELETE FROM tarefas WHERE id = ? AND usuario_id = ?').run(id, usuarioId);
    return info.changes > 0;
  }

  _paraEntidade(row) {
    const tarefa = new Tarefa({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      categoria: row.categoria,
    });
    if (row.status === 'concluida') tarefa.concluir();
    return tarefa;
  }
}

module.exports = { TarefaRepository };