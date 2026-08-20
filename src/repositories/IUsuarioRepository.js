class IUsuarioRepository {
  criar(_usuario) {
    throw new Error('Método criar() não implementado.');
  }

  buscarPorEmail(_email) {
    throw new Error('Método buscarPorEmail() não implementado.');
  }

  buscarPorId(_id) {
    throw new Error('Método buscarPorId() não implementado.');
  }
}

module.exports = { IUsuarioRepository };