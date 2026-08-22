import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { TaskRow } from '../components/TaskRow';
import { Modal } from '../components/Modal';
import { ListaFormModal } from '../components/ListaFormModal';
import { UserMenu } from '../components/UserMenu';

const SEM_CATEGORIA = 'Sem categoria';

export function TasksPage() {
  const { usuario, sair } = useAuth();

  const [listas, setListas] = useState([]);
  const [listaAtivaId, setListaAtivaId] = useState(null);
  const [carregandoListas, setCarregandoListas] = useState(true);

  const [tarefas, setTarefas] = useState([]);
  const [carregandoTarefas, setCarregandoTarefas] = useState(false);
  const [erro, setErro] = useState('');

  const [titulo, setTitulo] = useState('');
  const [categoriaNova, setCategoriaNova] = useState('');

  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [tarefaExcluindo, setTarefaExcluindo] = useState(null);

  const [listaModalAberto, setListaModalAberto] = useState(false);
  const [listaEditando, setListaEditando] = useState(null);
  const [listaExcluindo, setListaExcluindo] = useState(null);

  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  useEffect(() => {
    function aoClicarFora(evento) {
      if (!evento.target.closest('.user-menu')) {
        setMenuUsuarioAberto(false);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  useEffect(() => {
    carregarListas();
  }, []);

  useEffect(() => {
    if (listaAtivaId) carregarTarefas(listaAtivaId);
  }, [listaAtivaId]);

  async function carregarListas() {
    try {
      setCarregandoListas(true);
      const dados = await api.listarListas();
      setListas(dados);
      if (dados.length > 0 && !dados.some((l) => l.id === listaAtivaId)) {
        setListaAtivaId(dados[0].id);
      } else if (dados.length === 0) {
        setListaAtivaId(null);
        setTarefas([]);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregandoListas(false);
    }
  }

  async function carregarTarefas(listaId) {
    try {
      setCarregandoTarefas(true);
      const dados = await api.listarTarefas(listaId);
      setTarefas(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregandoTarefas(false);
    }
  }

  const listaAtiva = listas.find((l) => l.id === listaAtivaId) || null;

  // ---------- listas ----------

  async function aoSalvarLista({ nome, resetarDiariamente }) {
    try {
      if (listaEditando) {
        await api.atualizarLista(listaEditando.id, { nome, resetarDiariamente });
      } else {
        const nova = await api.criarLista({ nome, resetarDiariamente });
        setListaAtivaId(nova.id);
      }
      setListaModalAberto(false);
      setListaEditando(null);
      setErro('');
      await carregarListas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function aoConfirmarExclusaoLista() {
    try {
      await api.removerLista(listaExcluindo.id);
      setListaExcluindo(null);
      setErro('');
      await carregarListas();
    } catch (err) {
      setErro(err.message);
    }
  }

  // ---------- tarefas ----------

  async function aoCriarTarefa(evento) {
    evento.preventDefault();
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo || !listaAtivaId) return;

    try {
      await api.criarTarefa({
        titulo: tituloLimpo,
        descricao: '',
        categoria: categoriaNova.trim() || null,
        listaId: listaAtivaId,
      });
      setTitulo('');
      setCategoriaNova('');
      setErro('');
      await carregarTarefas(listaAtivaId);
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
      await carregarTarefas(listaAtivaId);
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
      await carregarTarefas(listaAtivaId);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function aoConfirmarExclusao() {
    try {
      await api.removerTarefa(tarefaExcluindo.id);
      setTarefaExcluindo(null);
      setErro('');
      await carregarTarefas(listaAtivaId);
    } catch (err) {
      setErro(err.message);
    }
  }

  const categorias = useMemo(
    () => [...new Set(tarefas.map((t) => t.categoria || SEM_CATEGORIA))].sort(),
    [tarefas]
  );

  const pendentes = tarefas.filter((t) => t.status !== 'concluida');
  const concluidas = tarefas.filter((t) => t.status === 'concluida');

  const porCategoria = useMemo(() => {
    return pendentes.reduce((acc, t) => {
      const chave = t.categoria || SEM_CATEGORIA;
      acc[chave] = acc[chave] || [];
      acc[chave].push(t);
      return acc;
    }, {});
  }, [pendentes]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-card-top">
            <div className="brand-card-textos">
              <span className="brand-name">Feito.</span>
              <span className="brand-tag">olá, {usuario?.nome?.split(' ')[0]}</span>
            </div>
            <div className="brand-card-user">
              <UserMenu
                usuario={usuario}
                aberto={menuUsuarioAberto}
                onToggle={() => setMenuUsuarioAberto((v) => !v)}
                onSair={sair}
                sobreGradiente
              />
            </div>
          </div>
        </div>

        <div className="listas-card">
          <div className="listas-header">
            <span>Suas listas</span>
            <button type="button" className="btn-nova-lista" onClick={() => { setListaEditando(null); setListaModalAberto(true); }}>
              + Nova
            </button>
          </div>

          <nav className="category-nav">
            {listas.map((lista) => (
              <div key={lista.id} className={`lista-item-wrapper${lista.id === listaAtivaId ? ' active' : ''}`}>
                <button
                  type="button"
                  className={`category-item${lista.id === listaAtivaId ? ' active' : ''}`}
                  onClick={() => setListaAtivaId(lista.id)}
                >
                  {lista.nome}
                  {lista.resetarDiariamente && <span className="badge-reset" title="Reseta todo dia">↻</span>}
                </button>
                <div className="lista-item-acoes">
                  <button type="button" onClick={() => { setListaEditando(lista); setListaModalAberto(true); }}>Editar</button>
                  <button type="button" className="excluir" onClick={() => setListaExcluindo(lista)}>Excluir</button>
                </div>
              </div>
            ))}
            {!carregandoListas && listas.length === 0 && (
              <p className="estado-vazio-sidebar">Crie sua primeira lista.</p>
            )}
          </nav>
        </div>
      </aside>

      <main className="content">
        <div className="content-inner">
        <header className="content-header">
          <div>
            <h1>{listaAtiva?.nome || 'Suas tarefas'}</h1>
            <p className="subtitle">
              {listaAtiva?.resetarDiariamente
                ? 'Essa lista reseta as tarefas concluídas todo dia.'
                : 'Suas tarefas, organizadas por categoria.'}
            </p>
          </div>
          <div className="content-header-user">
            <UserMenu
              usuario={usuario}
              aberto={menuUsuarioAberto}
              onToggle={() => setMenuUsuarioAberto((v) => !v)}
              onSair={sair}
            />
          </div>
        </header>

        {erro && <p className="feedback">{erro}</p>}

        {!carregandoListas && listas.length === 0 ? (
          <div className="estado-vazio-central">
            <p>Você ainda não tem nenhuma lista.</p>
            <button type="button" className="btn-dark" onClick={() => { setListaEditando(null); setListaModalAberto(true); }}>
              Criar minha primeira lista
            </button>
          </div>
        ) : (
          <>
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
                <button type="submit" className="btn-adicionar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="btn-adicionar-texto">Adicionar</span>
                </button>
              </div>
            </form>

            {carregandoTarefas ? (
              <p className="estado-vazio">Carregando tarefas...</p>
            ) : tarefas.length === 0 ? (
              <p className="estado-vazio">Nada por aqui ainda. Adicione sua primeira tarefa acima.</p>
            ) : (
              <div className="lista-tarefas">
                {Object.keys(porCategoria).sort().map((cat) => (
                  <div key={cat}>
                    <p className="secao-titulo">{cat}</p>
                    {porCategoria[cat].map((t) => (
                      <TaskRow key={t.id} tarefa={t} onAlternar={aoAlternar} onEditar={setTarefaEditando} onExcluir={setTarefaExcluindo} />
                    ))}
                  </div>
                ))}
                {pendentes.length === 0 && <p className="estado-vazio">Nenhuma tarefa pendente. Bom trabalho!</p>}

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
          </>
        )}
        </div>
      </main>

      <ListaFormModal
        aberto={listaModalAberto}
        listaEditando={listaEditando}
        onFechar={() => { setListaModalAberto(false); setListaEditando(null); }}
        onSalvar={aoSalvarLista}
      />

      <Modal titulo="Excluir lista" aberto={!!listaExcluindo} onFechar={() => setListaExcluindo(null)}>
        {listaExcluindo && (
          <div className="modal-form">
            <p>Excluir a lista "<strong>{listaExcluindo.nome}</strong>"? Todas as tarefas dela também serão excluídas. Essa ação não pode ser desfeita.</p>
            <div className="modal-footer">
              <button type="button" className="btn-link" onClick={() => setListaExcluindo(null)}>Cancelar</button>
              <button type="button" className="btn-danger" onClick={aoConfirmarExclusaoLista}>Excluir</button>
            </div>
          </div>
        )}
      </Modal>

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