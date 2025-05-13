import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import FlowViewer from './pages/FlowViewer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FlowEditor from './pages/FlowEditor'
import CreateOrganization from './pages/CreateOrganization';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/flow-editor"
              element={
                //  <ProtectedRoute> 
                  <FlowEditor />
                //  </ProtectedRoute>
              }
            />
            <Route
              path="/flow-viewer"
              element={
                //  <ProtectedRoute> 
                  <FlowViewer />
                //  </ProtectedRoute>
              }
            />
            <Route path="/create-organization" element={<CreateOrganization />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App
