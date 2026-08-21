import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  const entrar = useCallback(async ({ email, senha }) => {
    const resultado = await api.login({ email, senha });
    api.definirToken(resultado.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    setUsuario(resultado.usuario);
  }, []);

  const registrar = useCallback(async ({ nome, email, senha }) => {
    const resultado = await api.registrar({ nome, email, senha });
    api.definirToken(resultado.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    setUsuario(resultado.usuario);
  }, []);

  const sair = useCallback(() => {
    api.definirToken(null);
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  const value = { usuario, autenticado: !!usuario, entrar, registrar, sair };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de um AuthProvider.');
  return ctx;
}