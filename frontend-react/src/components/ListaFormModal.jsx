import { useState, useEffect } from 'react';
import { Modal } from './Modal';

export function ListaFormModal({ aberto, listaEditando, onFechar, onSalvar }) {
  const [nome, setNome] = useState('');
  const [resetarDiariamente, setResetarDiariamente] = useState(false);

  useEffect(() => {
    if (aberto) {
      setNome(listaEditando?.nome || '');
      setResetarDiariamente(listaEditando?.resetarDiariamente || false);
    }
  }, [aberto, listaEditando]);

  function aoEnviar(evento) {
    evento.preventDefault();
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;
    onSalvar({ nome: nomeLimpo, resetarDiariamente });
  }

  return (
    <Modal titulo={listaEditando ? 'Editar lista' : 'Nova lista'} aberto={aberto} onFechar={onFechar}>
      <form className="modal-form" onSubmit={aoEnviar}>
        <label htmlFor="lista-nome">Nome da lista</label>
        <input
          id="lista-nome"
          type="text"
          placeholder="Ex: Afazeres diários, O que assistir..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />

        <label className="toggle-linha">
          <input
            type="checkbox"
            checked={resetarDiariamente}
            onChange={(e) => setResetarDiariamente(e.target.checked)}
          />
          <span>
            Resetar tarefas concluídas todo dia
            <small>As tarefas marcadas como feitas voltam a ficar pendentes à meia-noite.</small>
          </span>
        </label>

        <div className="modal-footer">
          <button type="button" className="btn-link" onClick={onFechar}>Cancelar</button>
          <button type="submit" className="btn-dark">
            {listaEditando ? 'Salvar alterações' : 'Criar lista'}
          </button>
        </div>
      </form>
    </Modal>
  );
}