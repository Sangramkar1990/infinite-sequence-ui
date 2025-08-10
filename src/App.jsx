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
import CreateSequence from './pages/CreateSequence'
import CreateCardPage from './pages/CreateCardPage' // Add this import
import Account from "./pages/Account";
import Organization from "./pages/Organization"; // Add this import
import Teams from './pages/Teams';
import Roles from './pages/Roles'; // Add this import
import ShareSequenceForm from './pages/Share'
import Dashboard from './pages/Dashboard'; // Add this import
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
            <Route path="/account" element={
              // <ProtectedRoute>
              <Account/>
              // </ProtectedRoute>
              
              }/>
            <Route path="/organization" element={ // Add this new route
              // <ProtectedRoute>
              <Organization/>
              // </ProtectedRoute>
            }/>
            <Route
              path="/flow-editor"
              element={
                  //<ProtectedRoute> 
                  <FlowEditor />
                  //</ProtectedRoute>
              }
            />
            <Route
              path="/flow-viewer"
              element={
                 //<ProtectedRoute> 
                  <FlowViewer />
                  //</ProtectedRoute>
              }
            />
            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route path="/create-sequence" element={
              //<ProtectedRoute> 
              <CreateSequence />
              //</ProtectedRoute> 
              } />
            <Route path="/create-card" element={
              //<ProtectedRoute>
              <CreateCardPage />
              //</ProtectedRoute>
            } />
            <Route path="/teams" element={<Teams organizationId={1} />} />
            <Route path="/roles" element={<Roles />} />
            // Share Sequence Form
            <Route path="/share" element={
              
              <ShareSequenceForm />
              
            } />
            <Route path="dashboard" element={<Dashboard/>} />

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App
