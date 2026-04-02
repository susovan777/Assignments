import { useState, useCallback, useEffect } from 'react';
import { fetchUrls, uploadFile } from '../api/upload.js';

export const useNavigator = () => {
  const [urls, setUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState(null);

  // Auto load latest saved URLs on first load
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUrls();

        if (data.urls.length > 0) {
          setUrls(data.urls);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('❌ Unable to get URL list:', error.message);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    load();
  }, []);

  const handleUpload = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadFile(file);
      setUrls(data.urls);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, urls.length - 1));
  }, [urls.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  return {
    urls,
    currentIndex,
    currentUrl: urls[currentIndex] ?? null,
    isLoading,
    isLoadingInitial,
    error,
    handleUpload,
    goNext,
    goPrev,
    goTo,
    isFirst: currentIndex === 0,
    isLast: currentIndex === urls.length - 1,
  };
};
