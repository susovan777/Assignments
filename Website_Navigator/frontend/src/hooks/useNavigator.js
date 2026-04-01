import { useState, useCallback } from 'react'
import { uploadFile } from '../api/Upload.js'

export const useNavigator = () => {
  const [urls, setUrls] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = useCallback(async (file) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await uploadFile(file)
      setUrls(data.urls)
      setCurrentIndex(0)           // always start from first URL
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, urls.length - 1))
  }, [urls.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const goTo = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  return {
    urls,
    currentIndex,
    currentUrl: urls[currentIndex] ?? null,
    isLoading,
    error,
    handleUpload,
    goNext,
    goPrev,
    goTo,
    isFirst: currentIndex === 0,
    isLast: currentIndex === urls.length - 1,
  }
}