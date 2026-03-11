import { people } from '../data/people';

export default function DetailView({ personKey, uploaded, onShowHome, onOpenPdf, onOpenUpload }) {
  const person = people[personKey];
  if (!person) return null;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onShowHome}>All Applicants</span>
        <span style={{ color: 'var(--border2)' }}>/</span>
        <span style={{ color: 'var(--text)' }}>{person.name}</span>
      </div>
      <div className="detail-head">
        <div className="det-avatar">{person.initials}</div>
        <div>
          <div className="det-name">{person.name}</div>
          <div className="det-meta">Applicant · Document Folder</div>
        </div>
      </div>
      <div className="sec-label">Documents</div>
      <div className="doc-list">
        {person.docs.map((doc) => {
          const docUrl = doc.url || uploaded[`${personKey}_${doc.id}`] || null;
          const isUp = !!docUrl;

          return (
            <div
              key={doc.id}
              className="doc-row"
              onClick={() => {
                if (isUp) {
                  onOpenPdf(doc, docUrl, personKey);
                } else {
                  onOpenUpload(personKey, doc);
                }
              }}
            >
              <div className="doc-icon">{doc.icon}</div>
              <div className="doc-info">
                <div className="doc-name">{doc.name}</div>
                <div className="doc-meta">{doc.meta}</div>
              </div>
              <span className={`badge ${isUp ? 'badge-uploaded' : 'badge-pending'}`}>
                {isUp ? 'Uploaded' : 'Pending'}
              </span>
              <div className="doc-action">
                {isUp ? '📂 View →' : '⬆ Upload →'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
