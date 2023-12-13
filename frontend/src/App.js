import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from './components/AdminHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import Timetrack from './pages/Timetrack';
import AdminDashboard from './pages/AdminDashboard';
import UserHeader from './components/UserHeader'
import UserLogin from './pages/userLogin';
import UserRegister from './pages/userRegister';
import Dashboard from './pages/Dashboard';
import io from 'socket.io-client'; // Import the socket.io-client library
import Activitylog from './pages/Activitylog';

const socket = io.connect(process.env.REACT_APP_SOCKET_URL); // Connect to the socket.io server on the "/api" path

function App() {
  const url = window.location.href;
  let regex = /admin/
  const admin = regex.test(url)
  return (
    <>
      <Router>
        <div className='container'>
          {admin ? <AdminHeader /> : <UserHeader />}
          <Routes>
            <Route path='/admin/timetrack' element={<Timetrack />} />
            <Route path='/admin/activitylog' element={<Activitylog />} />
            <Route path='/admin/login' element={<Login />} />
            <Route path='/admin/register' element={<Register />} />
            <Route path='/admin' element={<AdminDashboard socket={socket} />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/' element={<UserLogin />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;