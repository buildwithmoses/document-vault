import { useState, useEffect } from 'react';

export default function PdfViewer({ doc, url, onClose }) {
  const hasMultiple = doc.urls && doc.urls.length > 1;
  const [side, setSide] = useState(0);
  const activeUrl = hasMultiple ? doc.urls[side].url : url;
  const activeLabel = hasMultiple ? doc.urls[side].label : null;

  const [status, setStatus] = useState('loading');
  const [blobUrl, setBlobUrl] = useState(null);

  const isImage = /\.(png|jpe?g|gif|webp)(\?|$)/i.test(activeUrl);
  const isDL = doc.id === 'id-f';

  useEffect(() => {
    let revoke = null;
    setStatus('loading');

    fetch(activeUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.blob();
      })
      .then((blob) => {
        const objUrl = URL.createObjectURL(blob);
        revoke = objUrl;
        setBlobUrl(objUrl);
        setStatus('loaded');
      })
      .catch(() => {
        setStatus('error');
      });

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [activeUrl]);

  return (
    <div className="screen-pdf">
      <div className="pdf-bar">
        <button className="pdf-back" onClick={onClose}>← Back</button>
        <div className="pdf-info">
          <div className="pdf-doc-title">
            {doc.name}{activeLabel ? ` — ${activeLabel}` : ''}
          </div>
          <div className="pdf-doc-sub">{doc.meta}</div>
        </div>
        <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="pdf-ext-link">
          ↗ Open in new tab
        </a>
      </div>
      {hasMultiple && (
        <div className="dl-toggle-bar">
          <div className="dl-toggle">
            {doc.urls.map((u, i) => (
              <button
                key={i}
                className={`dl-toggle-btn${i === side ? ' active' : ''}`}
                onClick={() => setSide(i)}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`pdf-body${isDL ? ' dl-compact' : ''}`}>
        {status === 'loading' && (
          <div className="pdf-loading">
            <div className="pdf-spinner" />
            <div className="pdf-loading-text">Loading document…</div>
          </div>
        )}

        {status === 'loaded' && isImage && (
          <div className="pdf-image-container">
            <img src={blobUrl} alt={doc.name} />
          </div>
        )}

        {status === 'loaded' && !isImage && (
          <div className="pdf-iframe-container">
            <iframe src={blobUrl} title={doc.name} />
          </div>
        )}

        {status === 'error' && (
          <div className="pdf-fallback">
            <div className="pdf-fallback-icon">📄</div>
            <div className="pdf-fallback-title">{doc.name}</div>
            <div className="pdf-fallback-sub">Click below to open the document directly.</div>
            <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="pdf-fallback-link">
              ↗ Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
