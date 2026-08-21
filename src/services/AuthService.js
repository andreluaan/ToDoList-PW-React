const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-desenvolvimento-troque-em-producao';
const JWT_EXPIRA_EM = '7d';
const SALT_ROUNDS = 10;

class AuthService {
  /** @param {import('../repositories/IUsuarioRepository').IUsuarioRepository} usuarioRepository */
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  registrar({ nome, email, senha }) {
    if (!senha || senha.length < 6) {
      throw new Error('A senha precisa ter pelo menos 6 caracteres.');
    }

    const emailNormalizado = this._normalizarEmail(email);

    const jaExiste = this.usuarioRepository.buscarPorEmail(emailNormalizado);
    if (jaExiste) {
      throw new Error('Já existe um usuário com esse e-mail.');
    }

    const senhaHash = bcrypt.hashSync(senha, SALT_ROUNDS);
    const usuario = new Usuario({ nome, email: emailNormalizado, senhaHash });
    const id = this.usuarioRepository.criar(usuario);

    return this._gerarResposta(id, nome, emailNormalizado);
  }

  login({ email, senha }) {
    const emailNormalizado = this._normalizarEmail(email);
    const usuario = this.usuarioRepository.buscarPorEmail(emailNormalizado);
    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const senhaConfere = bcrypt.compareSync(senha || '', usuario.senhaHash);
    if (!senhaConfere) {
      throw new Error('E-mail ou senha inválidos.');
    }

    return this._gerarResposta(usuario.id, usuario.toJSON().nome, usuario.email);
  }

  _normalizarEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  _gerarResposta(id, nome, email) {
    const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXPIRA_EM });
    return { token, usuario: { id, nome, email } };
  }
}

module.exports = { AuthService, JWT_SECRET };