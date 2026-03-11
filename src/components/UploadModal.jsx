import { useState, useRef } from 'react';
import { people } from '../data/people';

export default function UploadModal({ personKey, doc, onConfirm, onClose }) {
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const person = people[personKey];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleConfirm = () => {
    onConfirm(personKey, doc.id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-bg" onClick={handleBackdropClick}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-head-title">{doc.name}</div>
            <div className="modal-head-sub">{person.name} · {doc.meta}</div>
          </div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <div className="uz-icon">📄</div>
            <div className="uz-text">Click to select a file</div>
            <div className="uz-hint">PDF, JPG, PNG · Max 10MB</div>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
          {fileName && (
            <div className="file-preview">
              <span>📎</span>
              <span>{fileName}</span>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleConfirm}>Mark as Uploaded</button>
        </div>
      </div>
    </div>
  );
}
