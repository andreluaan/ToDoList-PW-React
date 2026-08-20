class AuthController {
  /** @param {import('../services/AuthService').AuthService} authService */
  constructor(authService) {
    this.authService = authService;
  }

  registrar = (req, res) => {
    try {
      const resultado = this.authService.registrar(req.body);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  };

  login = (req, res) => {
    try {
      const resultado = this.authService.login(req.body);
      res.json(resultado);
    } catch (err) {
      res.status(401).json({ erro: err.message });
    }
  };
}

module.exports = { AuthController };