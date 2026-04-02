import { useState, useEffect, useRef } from 'react';

const BrowserViewer = ({ url, refreshKey }) => {
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  // Reset state whenever the URL changes
  useEffect(() => {
    setBlocked(false);
    setLoading(true);
  }, [url, refreshKey]);

  const handleLoad = () => {
    setLoading(false);
    // Try reading iframe content — blocked sites throw a cross-origin error
    try {
      const doc = iframeRef.current?.contentDocument;
      // If the page loaded but is empty, it was likely blocked
      if (doc && doc.body && doc.body.innerHTML === '') {
        setBlocked(true);
      }
    } catch {
      // Cross-origin access denied = iframe loaded a real page, that's fine
    }
  };

  const handleError = () => {
    setLoading(false);
    setBlocked(true);
  };

  const openInTab = () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="relative flex-1 w-full h-full bg-gray-50">
      {/* Loading shimmer */}
      {loading && !blocked && (
        <div className="absolute inset-0 z-10 flex flex-col gap-3 p-6 bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-48 bg-gray-200 rounded-xl mt-2" />
        </div>
      )}

      {/* Blocked fallback */}
      {blocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-50">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              This site blocks embedding
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">{url}</p>
          </div>
          <button
            onClick={openInTab}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200
              rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in new tab
          </button>
        </div>
      )}

      {/* The actual iframe */}
      <iframe
        key={refreshKey}
        ref={iframeRef}
        src={url}
        onLoad={handleLoad}
        onError={handleError}
        title="Website preview"
        className={`w-full h-full border-none transition-opacity duration-300
          ${loading || blocked ? 'opacity-0' : 'opacity-100'}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default BrowserViewer;
