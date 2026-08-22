const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token') || null;
  }

  definirToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async _request(caminho, options = {}) {
    const headers = { ...(options.headers || {}) };

    if (options.body) headers['Content-Type'] = 'application/json';
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const resposta = await fetch(`${BASE_URL}${caminho}`, { ...options, headers });

    if (resposta.status === 204) return null;

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
      throw new Error(dados?.erro || 'Não foi possível completar a operação.');
    }

    return dados;
  }

  // ---------- auth ----------

  registrar({ nome, email, senha }) {
    return this._request('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });
  }

  login({ email, senha }) {
    return this._request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  // ---------- listas ----------

  listarListas() {
    return this._request('/listas', { method: 'GET' });
  }

  criarLista({ nome, resetarDiariamente }) {
    return this._request('/listas', {
      method: 'POST',
      body: JSON.stringify({ nome, resetarDiariamente }),
    });
  }

  atualizarLista(id, { nome, resetarDiariamente }) {
    return this._request(`/listas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nome, resetarDiariamente }),
    });
  }

  removerLista(id) {
    return this._request(`/listas/${id}`, { method: 'DELETE' });
  }

  // ---------- tarefas ----------

  listarTarefas(listaId) {
    return this._request(`/tarefas?listaId=${listaId}`, { method: 'GET' });
  }

  criarTarefa({ titulo, descricao, categoria, listaId }) {
    return this._request('/tarefas', {
      method: 'POST',
      body: JSON.stringify({ titulo, descricao, categoria, listaId }),
    });
  }

  atualizarTarefa(id, { titulo, descricao, categoria }) {
    return this._request(`/tarefas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ titulo, descricao, categoria }),
    });
  }

  concluirTarefa(id) {
    return this._request(`/tarefas/${id}/concluir`, { method: 'PATCH' });
  }

  reabrirTarefa(id) {
    return this._request(`/tarefas/${id}/reabrir`, { method: 'PATCH' });
  }

  removerTarefa(id) {
    return this._request(`/tarefas/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();