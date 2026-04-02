const NavBar = ({
  currentUrl,
  currentIndex,
  total,
  onPrev,
  onNext,
  refresh,
  isFirst,
  isLast,
}) => {
  const handleOpenTab = () => {
    if (currentUrl) window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center gap-2 px-3 shrink-0">
      {/* Prev button */}
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

      {/* Next button */}
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

      {/* Refresh button */}
      <button
        onClick={refresh}
        className="group w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Refresh"
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 group-active:rotate-360"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M22 10C22 10 19.995 7.26822 18.3662 5.63824C16.7373 4.00827 14.4864 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.1031 21 19.5649 18.2543 20.6482 14.5M22 10V4M22 10H16"
          />
        </svg>
      </button>

      {/* URL bar */}
      <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 h-8 overflow-hidden">
        {/* Lock icon */}
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

      {/* Counter badge */}
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
    </div>
  );
};

export default NavBar;
