import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import PoetryApp from './sampleApps/poetry/PoetryApp'
import BookingApp from './sampleApps/booking/BookingApp'
import AdminApp from './sampleApps/booking/admin/AdminApp'
import PublicInvoice from './sampleApps/invoicing/PublicInvoice'
import InvoicingAdminApp from './sampleApps/invoicing/admin/InvoicingAdminApp'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Navigate to="/about" replace />} />
          <Route path="/poetry" element={<PoetryApp />} />
          <Route path="/booking" element={<BookingApp />} />
          <Route path="/booking/admin" element={<AdminApp />} />
          <Route path="/invoicing/admin" element={<InvoicingAdminApp />} />
          <Route path="/invoicing/:token" element={<PublicInvoice />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
