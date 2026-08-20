class ITarefaRepository {
  salvar(_tarefa, _usuarioId) {
    throw new Error('Método salvar() não implementado.');
  }

  buscarPorId(_id, _usuarioId) {
    throw new Error('Método buscarPorId() não implementado.');
  }

  listar(_usuarioId) {
    throw new Error('Método listar() não implementado.');
  }

  remover(_id, _usuarioId) {
    throw new Error('Método remover() não implementado.');
  }
}

module.exports = { ITarefaRepository };