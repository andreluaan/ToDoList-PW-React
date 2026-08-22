export function obterIniciais(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export function UserMenu({ usuario, aberto, onToggle, onSair, sobreGradiente = false }) {
  return (
    <div className="user-menu">
      <button
        type="button"
        className={`user-avatar-btn${sobreGradiente ? ' sobre-gradiente' : ''}`}
        onClick={onToggle}
        aria-label="Menu do usuário"
        aria-expanded={aberto}
      >
        {obterIniciais(usuario?.nome)}
      </button>

      {aberto && (
        <div className="user-dropdown">
          <span className="user-dropdown-nome">{usuario?.nome}</span>
          <button type="button" className="user-dropdown-sair" onClick={onSair}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}