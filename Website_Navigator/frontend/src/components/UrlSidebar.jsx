import { useRef, useState } from 'react';

const UrlSidebar = ({
  urls,
  currentIndex,
  onSelect,
  onUpload,
  isLoading,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file) onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <aside className="w-64 shrink-0 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Import section */}
      <div className="px-3 pt-3 pb-3 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Import
        </p>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border border-dashed rounded-xl p-3 flex flex-col items-center gap-1.5
            cursor-pointer transition-colors
            ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-400 hover:border-gray-600 hover:bg-gray-50'
            }`}
        >
          <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          {isLoading ? (
            <p className="text-[11px] text-blue-500 font-medium">Parsing...</p>
          ) : (
            <>
              <p className="text-[11px] text-gray-600 text-center leading-tight">
                Drop <span className="text-blue-500">.xlsx</span> or .csv
              </p>
              <p className="text-[10px] text-gray-400">or click to browse</p>
            </>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-red-500 mt-1.5 text-center">{error}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {
            handleFile(e.target.files[0]);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Websites</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {urls.length} URLs loaded
        </p>
      </div>

      {/* URL list */}
      <ul className="flex-1 overflow-y-auto pb-2">
        {urls.length === 0 ? (
          <li className="px-3 py-8 text-center">
            <p className="text-xs text-gray-300">No URLs yet</p>
          </li>
        ) : (
          urls.map((url, index) => {
            const isActive = index === currentIndex;
            const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
            return (
              <li key={index}>
                <button
                  onClick={() => onSelect(index)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left
                    transition-colors border-r-2 cursor-pointer
                    ${
                      isActive
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                >
                  <span
                    className={`text-[10px] font-mono shrink-0 w-4 text-right
                    ${isActive ? 'text-blue-400' : 'text-gray-300'}`}
                  >
                    {index + 1}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0
                    ${isActive ? 'bg-blue-400' : 'bg-gray-200'}`}
                  />
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${url}&sz=16`}
                    alt=""
                    className="w-3.5 h-3.5 shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span
                    className={`text-[11px] truncate
                    ${
                      isActive ? 'text-blue-700 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {display}
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          {currentIndex + 1} / {urls.length}
        </p>
      </div>
    </aside>
  );
};

export default UrlSidebar;
