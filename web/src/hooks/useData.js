import { useState, useEffect } from 'react'

export function useCatalog() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/catalog.json')
      .then(r => r.json())
      .then(data => { setDatasets(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { datasets, loading }
}

export function useDataset(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/data/${id}.json`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  return { data, loading }
}
