import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Alerts from './pages/Alerts'
import Incidents from './pages/Incidents'
import Timeline from './pages/Timeline'
import Mitre from './pages/Mitre'
import Investigation from './pages/Investigation'

export default function App() {
  return <BrowserRouter><Layout><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/events" element={<Events />} />
    <Route path="/alerts" element={<Alerts />} />
    <Route path="/incidents" element={<Incidents />} />
    <Route path="/timeline" element={<Timeline />} />
    <Route path="/mitre" element={<Mitre />} />
    <Route path="/investigation" element={<Investigation />} />
  </Routes></Layout></BrowserRouter>
}
