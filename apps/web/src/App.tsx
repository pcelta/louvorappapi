import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterChurch from './pages/RegisterChurch'
import Login from './pages/Login'
import Home from './pages/Home'
import Members from './pages/Members'
import AcceptInvitation from './pages/AcceptInvitation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<RegisterChurch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/member-invitation/:code" element={<AcceptInvitation />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}