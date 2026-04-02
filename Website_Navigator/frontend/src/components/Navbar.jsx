export const NavBar = ({
  currentUrl,
  currentIndex,
  total,
  onPrev,
  onNext,
  isFirst,
  isLast,
  onRefresh,
}) => {
  const handleOpenTab = () =>
    window.open(currentUrl, '_blank', 'noopener,noreferrer');

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center gap-2 px-3 shrink-0">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Previous"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={onNext}
        disabled={isLast}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Next"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* URL bar */}
      <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 h-8 overflow-hidden">
        <svg
          className="w-3 h-3 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="text-xs text-gray-600 truncate">{currentUrl}</span>
      </div>

      {/* Counter */}
      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full shrink-0 font-mono">
        {currentIndex + 1} / {total}
      </span>

      {/* Open in new tab */}
      <button
        onClick={handleOpenTab}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
          hover:bg-gray-100 transition-colors"
        title="Open in new tab"
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
      </button>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
          hover:bg-gray-100 transition-colors"
        title="Reload page"
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};
