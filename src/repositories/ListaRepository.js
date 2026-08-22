const { IListaRepository } = require('./IListaRepository');
const { ListaDeTarefas } = require('../models/ListaDeTarefas');
const db = require('../database/db');
const { hojeISO } = require('../utils/data');

class ListaRepository extends IListaRepository {
  constructor() {
    super();
    this.db = db;
  }

  criar(lista) {
    const info = this.db.prepare(`
      INSERT INTO listas (nome, usuario_id, resetar_diariamente, ultimo_reset)
      VALUES (?, ?, ?, ?)
    `).run(lista.nome, lista.usuarioId, lista.resetarDiariamente ? 1 : 0, hojeISO());

    return Number(info.lastInsertRowid);
  }

  listar(usuarioId) {
    this._resetarSeNecessario(usuarioId);

    const rows = this.db.prepare(`
      SELECT * FROM listas WHERE usuario_id = ? ORDER BY criado_em
    `).all(usuarioId);

    return rows.map((row) => this._paraEntidade(row));
  }

  buscarPorId(id, usuarioId) {
    const row = this.db.prepare('SELECT * FROM listas WHERE id = ? AND usuario_id = ?').get(id, usuarioId);
    return row ? this._paraEntidade(row) : null;
  }

  atualizar(lista) {
    this.db.prepare(`
      UPDATE listas SET nome = ?, resetar_diariamente = ?
      WHERE id = ? AND usuario_id = ?
    `).run(lista.nome, lista.resetarDiariamente ? 1 : 0, lista.id, lista.usuarioId);
  }

  remover(id, usuarioId) {
    const info = this.db.prepare('DELETE FROM listas WHERE id = ? AND usuario_id = ?').run(id, usuarioId);
    return info.changes > 0;
  }

  /**
   * Reset "preguiçoso": em vez de depender de um cron rodando exatamente à
   * meia-noite (o que exigiria o servidor de pé 24/7), a checagem acontece
   * sempre que as listas do usuário são carregadas. Se uma lista marcada
   * como "resetar diariamente" não é resetada desde ANTES de hoje, as
   * tarefas concluídas dela voltam a ficar pendentes agora.
   */
  _resetarSeNecessario(usuarioId) {
    const hoje = hojeISO();

    const listasParaResetar = this.db.prepare(`
      SELECT id FROM listas
      WHERE usuario_id = ? AND resetar_diariamente = 1 AND ultimo_reset < ?
    `).all(usuarioId, hoje);

    for (const { id } of listasParaResetar) {
      this.db.prepare(`
        UPDATE tarefas SET status = 'pendente' WHERE lista_id = ? AND status = 'concluida'
      `).run(id);

      this.db.prepare('UPDATE listas SET ultimo_reset = ? WHERE id = ?').run(hoje, id);
    }
  }

  _paraEntidade(row) {
    return new ListaDeTarefas({
      id: row.id,
      nome: row.nome,
      usuarioId: row.usuario_id,
      resetarDiariamente: !!row.resetar_diariamente,
    });
  }
}

module.exports = { ListaRepository };