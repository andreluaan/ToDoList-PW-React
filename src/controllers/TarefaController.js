class TarefaController {
  /** @param {import('../services/TarefaService').TarefaService} service */
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const tarefa = this.service.criarTarefa(req.body, req.usuarioId);
      res.status(201).json(tarefa);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  };

  listar = (req, res) => {
    res.json(this.service.listarTarefas(req.usuarioId));
  };

  buscar = (req, res) => {
    try {
      res.json(this.service.buscarTarefa(req.params.id, req.usuarioId));
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  };

  concluir = (req, res) => {
    try {
      res.json(this.service.concluirTarefa(req.params.id, req.usuarioId));
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  };

  reabrir = (req, res) => {
    try {
      res.json(this.service.reabrirTarefa(req.params.id, req.usuarioId));
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  };

  atualizar = (req, res) => {
    try {
      const tarefa = this.service.atualizarTarefa(req.params.id, req.body, req.usuarioId);
      res.json(tarefa);
    } catch (err) {
      const status = err.message === 'Tarefa não encontrada.' ? 404 : 400;
      res.status(status).json({ erro: err.message });
    }
  };

  remover = (req, res) => {
    try {
      this.service.removerTarefa(req.params.id, req.usuarioId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  };
}

module.exports = { TarefaController };