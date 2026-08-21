export function Modal({ titulo, aberto, onFechar, children }) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{titulo}</h5>
          <button type="button" className="modal-fechar" onClick={onFechar} aria-label="Fechar">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}