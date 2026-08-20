const { Router } = require('express');
const { AuthController } = require('../controllers/AuthController');
const { AuthService } = require('../services/AuthService');
const { UsuarioRepository } = require('../repositories/UsuarioRepository');

const authService = new AuthService(new UsuarioRepository());
const controller = new AuthController(authService);

const router = Router();

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

module.exports = router;