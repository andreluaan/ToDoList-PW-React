class ListaController {
  /** @param {import('../services/ListaService').ListaService} service */
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const lista = this.service.criarLista(req.body, req.usuarioId);
      res.status(201).json(lista);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  };

  listar = (req, res) => {
    res.json(this.service.listarListas(req.usuarioId));
  };

  atualizar = (req, res) => {
    try {
      const lista = this.service.atualizarLista(req.params.id, req.body, req.usuarioId);
      res.json(lista);
    } catch (err) {
      const status = err.message === 'Lista não encontrada.' ? 404 : 400;
      res.status(status).json({ erro: err.message });
    }
  };

  remover = (req, res) => {
    try {
      this.service.removerLista(req.params.id, req.usuarioId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  };
}

module.exports = { ListaController };