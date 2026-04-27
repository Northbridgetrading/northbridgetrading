import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App