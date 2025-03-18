import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import components
import Header from './components/Header'
import CameraCapture from './components/CameraCapture'
import ImageUpload from './components/ImageUpload'
import ResultDisplay from './components/ResultDisplay'

// Import global styles
import './index.css'

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header /> {/* ✅ Now used */}
        <main className="content">
          <Routes>
            <Route path="/" element={<ImageUpload />} />  {/* ✅ Now used */}
            <Route path="/camera" element={<CameraCapture />} />  {/* ✅ Now used */}
            <Route path="/results" element={<ResultDisplay />} />  {/* ✅ Now used */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
