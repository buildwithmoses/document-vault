import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfViewer({ doc, url, onClose }) {
  const hasMultiple = doc.urls && doc.urls.length > 1;
  const [side, setSide] = useState(0);
  const activeUrl = hasMultiple ? doc.urls[side].url : url;
  const activeLabel = hasMultiple ? doc.urls[side].label : null;

  const [status, setStatus] = useState('loading');
  const [blobUrl, setBlobUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const isImage = /\.(png|jpe?g|gif|webp)(\?|$)/i.test(activeUrl);
  const isDL = doc.id === 'id-f';

  const containerRef = useCallback((node) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(node);
    setContainerWidth(Math.floor(node.getBoundingClientRect().width));
  }, []);

  useEffect(() => {
    let revoke = null;
    setStatus('loading');
    setNumPages(0);

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

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = activeUrl;
    a.download = doc.name || 'document';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
        <button className="pdf-download" onClick={handleDownload}>
          ↓ Download
        </button>
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
          <div className="pdf-pages-container" ref={containerRef}>
            <Document
              file={blobUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={null}
              error={
                <div className="pdf-fallback">
                  <div className="pdf-fallback-icon">📄</div>
                  <div className="pdf-fallback-title">{doc.name}</div>
                  <div className="pdf-fallback-sub">Could not render PDF.</div>
                  <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="pdf-fallback-link">
                    ↗ Open in new tab
                  </a>
                </div>
              }
            >
              {containerWidth > 0 &&
                Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={containerWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
            </Document>
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
