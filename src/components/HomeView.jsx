import { people } from '../data/people';

export default function HomeView({ onShowPerson }) {
  return (
    <div>
      <span className="page-emoji">📁</span>
      <div className="page-title">All Applicants</div>
      <div className="page-sub">Click on an applicant to view their documents.</div>
      <div className="notice-bar">
        🔒 &nbsp;This vault is password protected. Documents are sensitive — do not share access.
      </div>
      <div className="persons-grid">
        {Object.entries(people).map(([key, person]) => (
          <div key={key} className="person-card" onClick={() => onShowPerson(key)}>
            <span className="card-arrow">↗</span>
            <div className="p-avatar">{person.initials}</div>
            <div className="p-name">{person.name}</div>
            <div className="p-role">Applicant</div>
            <div className="chips">
              {person.docs.map((doc) => (
                <span key={doc.id} className="chip">{doc.name.split(' ')[0]}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'IBM Plex Mono', monospace" }}>
        {Object.keys(people).length} applicants · {Object.values(people).reduce((sum, p) => sum + p.docs.length, 0)} document slots
      </div>
    </div>
  );
}
