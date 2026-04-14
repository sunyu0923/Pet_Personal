import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz/:petType" element={<QuizPage />} />
        <Route path="/result/:shareId" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}
