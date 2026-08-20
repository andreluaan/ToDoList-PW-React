const { Router } = require('express');
const { TarefaController } = require('../controllers/TarefaController');
const { TarefaService } = require('../services/TarefaService');
const { TarefaRepository } = require('../repositories/TarefaRepository');
const { autenticar } = require('../middlewares/authMiddleware');

const service = new TarefaService(new TarefaRepository());
const controller = new TarefaController(service);

const router = Router();

router.use(autenticar); // toda rota abaixo exige token válido

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.put('/:id', controller.atualizar);
router.patch('/:id/concluir', controller.concluir);
router.patch('/:id/reabrir', controller.reabrir);
router.delete('/:id', controller.remover);

module.exports = router;