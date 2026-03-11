import { people } from '../data/people';

export default function Sidebar({ activeView, activePerson, onShowHome, onShowPerson }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="ws-name">
          <span className="ws-icon">V</span>
          Document Vault
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        <div
          className={`nav-item${activeView === 'home' ? ' active' : ''}`}
          onClick={onShowHome}
        >
          <span className="nav-icon">🏠</span> All Applicants
        </div>
        {Object.entries(people).map(([key, person]) => (
          <div
            key={key}
            className={`nav-item${activeView === 'detail' && activePerson === key ? ' active' : ''}`}
            onClick={() => onShowPerson(key)}
          >
            <span className="nav-icon">👤</span> {person.name}
          </div>
        ))}
      </div>
      <div className="sidebar-foot">
        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>v1.0</span>
      </div>
    </div>
  );
}
