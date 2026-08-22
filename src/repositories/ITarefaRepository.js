class ITarefaRepository {
  inserir(_tarefa, _usuarioId, _listaId) {
    throw new Error('Método inserir() não implementado.');
  }

  atualizar(_tarefa, _usuarioId) {
    throw new Error('Método atualizar() não implementado.');
  }

  buscarPorId(_id, _usuarioId) {
    throw new Error('Método buscarPorId() não implementado.');
  }

  listar(_usuarioId, _listaId) {
    throw new Error('Método listar() não implementado.');
  }

  remover(_id, _usuarioId) {
    throw new Error('Método remover() não implementado.');
  }
}

module.exports = { ITarefaRepository };