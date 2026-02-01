import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Playground from './pages/Playground'
import Assessment from './pages/Assessment'
import Lesson from './pages/Lesson'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/lesson/:moduleId/:lessonId" element={<Lesson />} />
      </Routes>
    </Router>
  )
}

export default App