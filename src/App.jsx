import { useState, useEffect, useCallback } from 'react';
import './App.css';
import LockScreen from './components/LockScreen';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import DetailView from './components/DetailView';
import PdfViewer from './components/PdfViewer';
import UploadModal from './components/UploadModal';

const SESSION_TTL = 1 * 60 * 1000; // 1 minute

function isSessionValid() {
  const ts = sessionStorage.getItem('vault_auth_ts');
  if (!ts) return false;
  return Date.now() - Number(ts) < SESSION_TTL;
}

function App() {
  const [screen, setScreen] = useState(() => isSessionValid() ? 'app' : 'lock');
  const [activeView, setActiveView] = useState('home'); // 'home' | 'detail'
  const [activePerson, setActivePerson] = useState(null);
  const [uploaded, setUploaded] = useState({});

  // PDF viewer state
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfReturnPerson, setPdfReturnPerson] = useState(null);

  // Upload modal state
  const [uploadModal, setUploadModal] = useState(null); // { personKey, doc }

  const lock = useCallback(() => {
    sessionStorage.removeItem('vault_auth_ts');
    setScreen('lock');
  }, []);

  const handleUnlock = useCallback(() => {
    sessionStorage.setItem('vault_auth_ts', String(Date.now()));
    setScreen('app');
  }, []);

  // Auto-lock when session expires
  useEffect(() => {
    if (screen === 'lock') return;
    const ts = Number(sessionStorage.getItem('vault_auth_ts') || 0);
    const remaining = SESSION_TTL - (Date.now() - ts);
    if (remaining <= 0) { lock(); return; }
    const timer = setTimeout(lock, remaining);
    return () => clearTimeout(timer);
  }, [screen, lock]);

  const showHome = () => {
    setActiveView('home');
    setActivePerson(null);
  };

  const showPerson = (key) => {
    setActivePerson(key);
    setActiveView('detail');
  };

  const openPdf = (doc, url, personKey) => {
    setPdfDoc(doc);
    setPdfUrl(url);
    setPdfReturnPerson(personKey);
    setScreen('pdf');
  };

  const closePdf = () => {
    setScreen('app');
    if (pdfReturnPerson) {
      showPerson(pdfReturnPerson);
    }
    setPdfDoc(null);
    setPdfUrl(null);
  };

  const openUpload = (personKey, doc) => {
    setUploadModal({ personKey, doc });
  };

  const closeUpload = () => {
    setUploadModal(null);
  };

  const confirmUpload = (personKey, docId) => {
    setUploaded((prev) => ({ ...prev, [`${personKey}_${docId}`]: true }));
    setUploadModal(null);
  };

  // Lock screen
  if (screen === 'lock') {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  // PDF viewer
  if (screen === 'pdf' && pdfDoc && pdfUrl) {
    return <PdfViewer doc={pdfDoc} url={pdfUrl} onClose={closePdf} />;
  }

  // Main app
  return (
    <div className="screen-app">
      <Sidebar
        activeView={activeView}
        activePerson={activePerson}
        onShowHome={showHome}
        onShowPerson={showPerson}
      />
      <div className="main">
        {activeView === 'home' && (
          <HomeView onShowPerson={showPerson} />
        )}
        {activeView === 'detail' && activePerson && (
          <DetailView
            personKey={activePerson}
            uploaded={uploaded}
            onShowHome={showHome}
            onOpenPdf={openPdf}
            onOpenUpload={openUpload}
          />
        )}
      </div>

      {uploadModal && (
        <UploadModal
          personKey={uploadModal.personKey}
          doc={uploadModal.doc}
          onConfirm={confirmUpload}
          onClose={closeUpload}
        />
      )}
    </div>
  );
}

export default App;
