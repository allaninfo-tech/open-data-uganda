import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DatasetsPage from './pages/DatasetsPage'
import DatasetPage from './pages/DatasetPage'
import ApiPage from './pages/ApiPage'
import ContributePage from './pages/ContributePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/datasets" element={<DatasetsPage />} />
        <Route path="/dataset/:id" element={<DatasetPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
