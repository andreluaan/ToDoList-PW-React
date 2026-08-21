export function TaskRow({ tarefa, onAlternar, onEditar, onExcluir }) {
  const concluida = tarefa.status === 'concluida';

  return (
    <div className={`tarefa-linha${concluida ? ' concluida' : ''}`}>
      <input
        type="checkbox"
        className="tarefa-checkbox"
        checked={concluida}
        onChange={(e) => onAlternar(tarefa, e.target.checked)}
        aria-label={`Marcar "${tarefa.titulo}" como ${concluida ? 'pendente' : 'concluída'}`}
      />

      <div className="tarefa-corpo">
        <p className="tarefa-titulo">{tarefa.titulo}</p>
        {tarefa.descricao && <p className="tarefa-descricao">{tarefa.descricao}</p>}
      </div>

      <div className="tarefa-acoes">
        <button type="button" onClick={() => onEditar(tarefa)}>Editar</button>
        <button type="button" className="excluir" onClick={() => onExcluir(tarefa)}>Excluir</button>
      </div>
    </div>
  );
}