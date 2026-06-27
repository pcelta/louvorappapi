import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterChurch from './pages/RegisterChurch'
import Login from './pages/Login'
import Home from './pages/Home'
import Members from './pages/Members'
import Songs from './pages/Songs'
import SongForm from './pages/SongForm'
import SongDetail from './pages/SongDetail'
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
        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/new" element={<SongForm />} />
        <Route path="/songs/:uid" element={<SongDetail />} />
        <Route path="/songs/:uid/edit" element={<SongForm />} />
        <Route path="/member-invitation/:code" element={<AcceptInvitation />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}