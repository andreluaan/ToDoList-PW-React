const { randomUUID } = require('crypto');
const { Tarefa } = require('../models/Tarefa');

class TarefaService {
  /** @param {import('../repositories/ITarefaRepository').ITarefaRepository} repository */
  constructor(repository) {
    this.repository = repository;
  }

  criarTarefa({ titulo, descricao, categoria }, usuarioId, listaId) {
    if (!listaId) throw new Error('Toda tarefa precisa pertencer a uma lista.');
    const tarefa = new Tarefa({ id: randomUUID(), titulo, descricao, categoria });
    this.repository.inserir(tarefa, usuarioId, listaId);
    return tarefa;
  }

  listarTarefas(usuarioId, listaId) {
    if (!listaId) throw new Error('Informe a lista para listar as tarefas.');
    return this.repository.listar(usuarioId, listaId);
  }

  buscarTarefa(id, usuarioId) {
    const tarefa = this.repository.buscarPorId(id, usuarioId);
    if (!tarefa) throw new Error('Tarefa não encontrada.');
    return tarefa;
  }

  concluirTarefa(id, usuarioId) {
    const tarefa = this.buscarTarefa(id, usuarioId);
    tarefa.concluir();
    this.repository.atualizar(tarefa, usuarioId);
    return tarefa;
  }

  reabrirTarefa(id, usuarioId) {
    const tarefa = this.buscarTarefa(id, usuarioId);
    tarefa.reabrir();
    this.repository.atualizar(tarefa, usuarioId);
    return tarefa;
  }

  atualizarTarefa(id, { titulo, descricao, categoria }, usuarioId) {
    const tarefa = this.buscarTarefa(id, usuarioId);
    tarefa.atualizar({ titulo, descricao, categoria });
    this.repository.atualizar(tarefa, usuarioId);
    return tarefa;
  }

  removerTarefa(id, usuarioId) {
    const removida = this.repository.remover(id, usuarioId);
    if (!removida) throw new Error('Tarefa não encontrada.');
  }
}

module.exports = { TarefaService };