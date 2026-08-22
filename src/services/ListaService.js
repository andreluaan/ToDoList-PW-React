const { ListaDeTarefas } = require('../models/ListaDeTarefas');

class ListaService {
  /** @param {import('../repositories/IListaRepository').IListaRepository} repository */
  constructor(repository) {
    this.repository = repository;
  }

  criarLista({ nome, resetarDiariamente }, usuarioId) {
    const lista = new ListaDeTarefas({ nome, usuarioId, resetarDiariamente });
    const id = this.repository.criar(lista);
    return { id, nome: lista.nome, resetarDiariamente: lista.resetarDiariamente };
  }

  listarListas(usuarioId) {
    return this.repository.listar(usuarioId).map((lista) => lista.toJSON());
  }

  buscarLista(id, usuarioId) {
    const lista = this.repository.buscarPorId(id, usuarioId);
    if (!lista) throw new Error('Lista não encontrada.');
    return lista;
  }

  atualizarLista(id, { nome, resetarDiariamente }, usuarioId) {
    const lista = this.buscarLista(id, usuarioId);
    if (nome !== undefined) lista.renomear(nome);
    if (resetarDiariamente !== undefined) lista.alternarReset(resetarDiariamente);
    this.repository.atualizar(lista);
    return lista.toJSON();
  }

  removerLista(id, usuarioId) {
    const removida = this.repository.remover(id, usuarioId);
    if (!removida) throw new Error('Lista não encontrada.');
  }
}

module.exports = { ListaService };