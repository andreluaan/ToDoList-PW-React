class IListaRepository {
  criar(_lista) {
    throw new Error('Método criar() não implementado.');
  }

  listar(_usuarioId) {
    throw new Error('Método listar() não implementado.');
  }

  buscarPorId(_id, _usuarioId) {
    throw new Error('Método buscarPorId() não implementado.');
  }

  atualizar(_lista) {
    throw new Error('Método atualizar() não implementado.');
  }

  remover(_id, _usuarioId) {
    throw new Error('Método remover() não implementado.');
  }
}

module.exports = { IListaRepository };