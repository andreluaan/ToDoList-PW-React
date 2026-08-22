class ListaDeTarefas {
  #id;
  #nome;
  #usuarioId;
  #resetarDiariamente;

  constructor({ id, nome, usuarioId, resetarDiariamente = false }) {
    if (!nome) throw new Error('Lista precisa de um nome.');

    this.#id = id;
    this.#nome = nome;
    this.#usuarioId = usuarioId;
    this.#resetarDiariamente = !!resetarDiariamente;
  }

  get id() {
    return this.#id;
  }

  get nome() {
    return this.#nome;
  }

  get usuarioId() {
    return this.#usuarioId;
  }

  get resetarDiariamente() {
    return this.#resetarDiariamente;
  }

  renomear(nome) {
    if (!nome) throw new Error('Nome da lista não pode ficar vazio.');
    this.#nome = nome;
  }

  alternarReset(valor) {
    this.#resetarDiariamente = !!valor;
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      resetarDiariamente: this.#resetarDiariamente,
    };
  }
}

module.exports = { ListaDeTarefas };