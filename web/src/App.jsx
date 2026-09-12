import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CatalogPage from './pages/CatalogPage'
import DatasetPage from './pages/DatasetPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="/dataset/:id" element={<DatasetPage />} />
      </Route>
    </Routes>
  )
}
