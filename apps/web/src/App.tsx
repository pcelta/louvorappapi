import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterChurch from './pages/RegisterChurch'
import Login from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterChurch />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  )
}