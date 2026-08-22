const { Router } = require('express');
const { ListaController } = require('../controllers/ListaController');
const { ListaService } = require('../services/ListaService');
const { ListaRepository } = require('../repositories/ListaRepository');
const { autenticar } = require('../middlewares/authMiddleware');

const service = new ListaService(new ListaRepository());
const controller = new ListaController(service);

const router = Router();

router.use(autenticar);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;