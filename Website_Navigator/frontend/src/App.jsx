import { useEffect, useRef, useState } from 'react';
import { useNavigator } from './hooks/useNavigator';
import UrlSidebar from './components/UrlSidebar.jsx';
import { NavBar } from './components/Navbar.jsx';
import BrowserViewer from './components/BrowserViewer.jsx';

function App() {
  const nav = useNavigator();
  const fileInputRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!nav.currentUrl) return;
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') nav.goPrev();
      if (e.key === 'ArrowRight') nav.goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nav]);

  const handleRefresh = () => {
    setIframeKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* ── Top bar ── */}
      <header
        className="h-13 bg-white border-b border-gray-200 flex items-center
        justify-between px-5 shrink-0"
      >
        <div className="flex items-center gap-2.5 ">
          <img
            src="/web.png"
            alt="WebNavigator Logo"
            className="w-7 h-7 p-1 bg-gray-800 rounded-sm"
          />
          <span className="text-md font-semibold text-gray-800 tracking-tight">
            WebNavigator
          </span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={nav.isLoading}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
              bg-gray-900 text-white rounded-lg hover:bg-gray-700
              transition-colors disabled:opacity-50"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {nav.urls.length > 0 ? 'Add new file' : 'Upload file'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {
            nav.handleUpload(e.target.files[0]);
            e.target.value = '';
          }}
          className="hidden"
        />
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">
        <UrlSidebar
          urls={nav.urls}
          currentIndex={nav.currentIndex}
          onSelect={nav.goTo}
          onUpload={nav.handleUpload}
          isLoading={nav.isLoading}
          error={nav.error}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {nav.currentUrl ? (
            <>
              <NavBar
                currentUrl={nav.currentUrl}
                currentIndex={nav.currentIndex}
                total={nav.urls.length}
                onPrev={nav.goPrev}
                onNext={nav.goNext}
                isFirst={nav.isFirst}
                isLast={nav.isLast}
                onRefresh={handleRefresh}
              />
              <BrowserViewer key={iframeKey.current} url={nav.currentUrl} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              {nav.isLoadingInitial ? (
                <p className="text-sm text-gray-400">Loading saved URLs...</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600">
                    No URLs loaded
                  </p>
                  <p className="text-xs text-gray-400">
                    Upload a spreadsheet from the sidebar or the button above
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="h-7 bg-white border-t border-gray-100 flex items-center
        px-4 gap-4 shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-gray-400">Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-400">
            {nav.urls.length} URLs loaded
          </span>
        </div>
        <span className="text-xs text-gray-300 ml-auto">
          WebNavigator v1.0 · MERN Stack
        </span>
      </footer>
    </div>
  );
}

export default App;
