import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterChurch from './pages/RegisterChurch'
import Login from './pages/Login'
import Home from './pages/Home'
import Members from './pages/Members'
import Songs from './pages/Songs'
import Services from './pages/Services'
import ServicesPrototype from './pages/ServicesPrototype'
import SongForm from './pages/SongForm'
import SongDetail from './pages/SongDetail'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
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
        <Route path="/services" element={<Services />} />
        <Route path="/services/prototype" element={<ServicesPrototype />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/member-invitation/:code" element={<AcceptInvitation />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}