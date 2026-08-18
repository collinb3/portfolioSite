import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import PoetryApp from './sampleApps/poetry/PoetryApp'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/poetry" element={<PoetryApp />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
