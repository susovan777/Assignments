import { useState, useRef } from 'react';

const ACCEPTED = ['.xlsx', '.xls', '.csv'];

const UploadZone = ({ onUpload, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
          Website Navigator
        </h1>
        <p className="text-md text-gray-500 text-center mb-8">
          Upload a spreadsheet with URLs to get started
        </p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-2xl p-12
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-colors duration-200
            ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
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

          {isLoading ? (
            <p className="text-sm text-blue-500 font-medium">Parsing file...</p>
          ) : (
            <>
              <p className="text-md font-medium text-gray-700">
                Drop your file here, or{' '}
                <span className="text-blue-500">browse</span>
              </p>
              <p className="text-sm text-gray-400">{ACCEPTED.join(', ')}</p>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadZone;
