import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
// import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Timetrack from './pages/Timetrack'
import Landing from './pages/subcomponents/Landing'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://137.184.16.50:5000/');



function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path='/' element={<Landing socket={socket} />} />
            <Route path='/timetrack' element={<Timetrack />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
