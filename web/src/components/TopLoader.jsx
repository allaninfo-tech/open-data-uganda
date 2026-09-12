import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function TopLoader() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Start progress
    setVisible(true)
    setProgress(25)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const t1 = setTimeout(() => setProgress(65), 50)
    const t2 = setTimeout(() => setProgress(90), 120)
    const t3 = setTimeout(() => setProgress(100), 200)
    const t4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [location.pathname, location.search])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-200 ease-out"
      style={{
        height: '3px',
        width: `${progress}%`,
        backgroundColor: '#e11d48',
        boxShadow: '0 0 10px rgba(225, 29, 72, 0.7), 0 0 5px rgba(225, 29, 72, 0.4)',
        opacity: visible ? 1 : 0,
      }}
    />
  )
}
