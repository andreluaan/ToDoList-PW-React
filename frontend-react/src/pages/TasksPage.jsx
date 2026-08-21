import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { TaskRow } from '../components/TaskRow';
import { Modal } from '../components/Modal';

const SEM_CATEGORIA = 'Sem categoria';

export function TasksPage() {
  const { usuario, sair } = useAuth();

  const [tarefas, setTarefas] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [categoriaNova, setCategoriaNova] = useState('');
  const [descricaoNova, setDescricaoNova] = useState('');

  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [tarefaExcluindo, setTarefaExcluindo] = useState(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      const dados = await api.listarTarefas();
      setTarefas(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  const categorias = useMemo(
    () => [...new Set(tarefas.map((t) => t.categoria || SEM_CATEGORIA))].sort(),
    [tarefas]
  );

  useEffect(() => {
    if (categoriaAtiva && !categorias.includes(categoriaAtiva)) {
      setCategoriaAtiva('');
    }
  }, [categorias, categoriaAtiva]);

  async function aoCriarTarefa(evento) {
    evento.preventDefault();
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) return;

    try {
      await api.criarTarefa({
        titulo: tituloLimpo,
        descricao: descricaoNova.trim(),
        categoria: categoriaNova.trim() || null,
      });
      setTitulo('');
      setCategoriaNova('');
      setDescricaoNova('');
      setErro('');
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function aoAlternar(tarefa, marcarComoConcluida) {
    try {
      if (marcarComoConcluida) {
        await api.concluirTarefa(tarefa.id);
      } else {
        await api.reabrirTarefa(tarefa.id);
      }
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function aoSalvarEdicao(evento) {
    evento.preventDefault();
    try {
      await api.atualizarTarefa(tarefaEditando.id, {
        titulo: tarefaEditando.titulo.trim(),
        descricao: tarefaEditando.descricao?.trim() || '',
        categoria: tarefaEditando.categoria?.trim() || null,
      });
      setTarefaEditando(null);
      setErro('');
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function aoConfirmarExclusao() {
    try {
      await api.removerTarefa(tarefaExcluindo.id);
      setTarefaExcluindo(null);
      setErro('');
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  const listaFiltrada = useMemo(() => {
    if (!categoriaAtiva) return tarefas;
    return tarefas.filter((t) => (t.categoria || SEM_CATEGORIA) === categoriaAtiva);
  }, [tarefas, categoriaAtiva]);

  const pendentes = listaFiltrada.filter((t) => t.status !== 'concluida');
  const concluidas = listaFiltrada.filter((t) => t.status === 'concluida');

  const porCategoria = useMemo(() => {
    if (categoriaAtiva) return null; // visão de categoria única não precisa agrupar
    return pendentes.reduce((acc, t) => {
      const chave = t.categoria || SEM_CATEGORIA;
      acc[chave] = acc[chave] || [];
      acc[chave].push(t);
      return acc;
    }, {});
  }, [pendentes, categoriaAtiva]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <span className="brand-name">Feito.</span>
          <span className="brand-tag">olá, {usuario?.nome?.split(' ')[0]}</span>
        </div>

        <nav className="category-nav">
          <button
            type="button"
            className={`category-item${categoriaAtiva === '' ? ' active' : ''}`}
            onClick={() => setCategoriaAtiva('')}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-item${categoriaAtiva === cat ? ' active' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <button type="button" className="btn-sair" onClick={sair}>Sair</button>
      </aside>

      <main className="content">
        <header className="content-header">
          <h1>{categoriaAtiva || 'Todas'}</h1>
          <p className="subtitle">Suas tarefas, organizadas por categoria.</p>
        </header>

        <form className="add-task-card" onSubmit={aoCriarTarefa}>
          <div className="add-task-linha-principal">
            <input
              type="text"
              placeholder="Escreva uma tarefa..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <input
              type="text"
              list="categorias-existentes"
              placeholder="Categoria (opcional)"
              value={categoriaNova}
              onChange={(e) => setCategoriaNova(e.target.value)}
            />
            <datalist id="categorias-existentes">
              {categorias.map((cat) => <option key={cat} value={cat} />)}
            </datalist>
            <button type="submit">Adicionar</button>
          </div>
          <input
            type="text"
            className="add-task-descricao"
            placeholder="Descrição (opcional)"
            value={descricaoNova}
            onChange={(e) => setDescricaoNova(e.target.value)}
          />
        </form>

        {erro && <p className="feedback">{erro}</p>}

        {carregando ? (
          <p className="estado-vazio">Carregando tarefas...</p>
        ) : tarefas.length === 0 ? (
          <p className="estado-vazio">Nada por aqui ainda. Adicione sua primeira tarefa acima.</p>
        ) : (
          <div className="lista-tarefas">
            {categoriaAtiva === '' ? (
              <>
                {Object.keys(porCategoria).sort().map((cat) => (
                  <div key={cat}>
                    <p className="secao-titulo">{cat}</p>
                    {porCategoria[cat].map((t) => (
                      <TaskRow key={t.id} tarefa={t} onAlternar={aoAlternar} onEditar={setTarefaEditando} onExcluir={setTarefaExcluindo} />
                    ))}
                  </div>
                ))}
                {pendentes.length === 0 && <p className="estado-vazio">Nenhuma tarefa pendente. Bom trabalho!</p>}
              </>
            ) : (
              pendentes.map((t) => (
                <TaskRow key={t.id} tarefa={t} onAlternar={aoAlternar} onEditar={setTarefaEditando} onExcluir={setTarefaExcluindo} />
              ))
            )}

            {concluidas.length > 0 && (
              <>
                <p className="secao-titulo">Concluídas</p>
                {concluidas.map((t) => (
                  <TaskRow key={t.id} tarefa={t} onAlternar={aoAlternar} onEditar={setTarefaEditando} onExcluir={setTarefaExcluindo} />
                ))}
              </>
            )}
          </div>
        )}
      </main>

      <Modal titulo="Editar tarefa" aberto={!!tarefaEditando} onFechar={() => setTarefaEditando(null)}>
        {tarefaEditando && (
          <form className="modal-form" onSubmit={aoSalvarEdicao}>
            <label>Título</label>
            <input
              type="text"
              value={tarefaEditando.titulo}
              onChange={(e) => setTarefaEditando({ ...tarefaEditando, titulo: e.target.value })}
              required
            />
            <label>Descrição</label>
            <textarea
              rows={2}
              value={tarefaEditando.descricao || ''}
              onChange={(e) => setTarefaEditando({ ...tarefaEditando, descricao: e.target.value })}
            />
            <label>Categoria</label>
            <input
              type="text"
              value={tarefaEditando.categoria || ''}
              onChange={(e) => setTarefaEditando({ ...tarefaEditando, categoria: e.target.value })}
            />
            <div className="modal-footer">
              <button type="button" className="btn-link" onClick={() => setTarefaEditando(null)}>Cancelar</button>
              <button type="submit" className="btn-dark">Salvar alterações</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal titulo="Excluir tarefa" aberto={!!tarefaExcluindo} onFechar={() => setTarefaExcluindo(null)}>
        {tarefaExcluindo && (
          <div className="modal-form">
            <p>Tem certeza que deseja excluir "<strong>{tarefaExcluindo.titulo}</strong>"? Essa ação não pode ser desfeita.</p>
            <div className="modal-footer">
              <button type="button" className="btn-link" onClick={() => setTarefaExcluindo(null)}>Cancelar</button>
              <button type="button" className="btn-danger" onClick={aoConfirmarExclusao}>Excluir</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}