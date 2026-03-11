import { useState } from 'react';
import { PASSWORD } from '../data/people';

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (password === PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUnlock();
  };

  return (
    <div className="screen-lock">
      <div className="lock-card">
        <div className="lock-icon">🔐</div>
        <div className="lock-title">Document Vault</div>
        <div className="lock-sub">Enter your password to access applicant documents.</div>
        <input
          className="lock-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="lock-btn" onClick={handleUnlock}>Unlock Vault</button>
        {error && <div className="lock-error">Incorrect password. Try again.</div>}
      </div>
    </div>
  );
}
