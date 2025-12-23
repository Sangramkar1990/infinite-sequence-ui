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
import Techniques from './pages/techniques'; // Add this import
import TechniquesNew from './pages/TechniquesNew'; // Add this import
import AccountNewPage from './pages/AccountNew';
import Sequences from './pages/sequences'; // Add this import
// import FlowBuilder from './pages/FlowBuilder_old'; // Add this import
import FlowBuilder from './pages/FlowBuilder'; // Add this import
// import TestBuilder2 from './pages/TestBuilder2'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'
import Player from './pages/Player';

function App() {
  return (
    <AuthProvider>
      <Router>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account-old" element={
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
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/techniques" element={<TechniquesNew/>} />
            <Route path="/account" element={<AccountNewPage/>}/>
            <Route path="/sequences" element={<Sequences/>}/>
            <Route path="/flow-builder" element={<FlowBuilder/>}/>
            <Route path="/player" element={<Player/>}/>
            {/* <Route path="/test-builder" element={<FlowBuilderTest/>}/>
            <Route path="/test-builder-2" element={<TestBuilder2/>}/> */}



          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App
