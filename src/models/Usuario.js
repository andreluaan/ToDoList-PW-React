class Usuario {
  #id;
  #nome;
  #email;
  #senhaHash;

  constructor({ id, nome, email, senhaHash }) {
    if (!nome) throw new Error('Usuário precisa de um nome.');
    if (!email) throw new Error('Usuário precisa de um e-mail.');
    if (!senhaHash) throw new Error('Usuário precisa de uma senha.');

    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#senhaHash = senhaHash;
  }

  get id() {
    return this.#id;
  }

  get nome() {
    return this.#nome;
  }

  get email() {
    return this.#email;
  }

  get senhaHash() {
    return this.#senhaHash;
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      // senhaHash NUNCA sai daqui de propósito
    };
  }
}

module.exports = { Usuario };