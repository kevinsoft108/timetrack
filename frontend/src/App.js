import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Timetrack from './pages/Timetrack';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/userLogin';
import UserRegister from './pages/userRegister';
import Dashboard from './pages/Dashboard';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('https://144.126.254.71:5000/');

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/admin/timetrack' element={<Timetrack />} />
            <Route path='/admin/login' element={<Login />} />
            <Route path='/admin/register' element={<Register />} />
            <Route path='/admin' element={<AdminDashboard socket={socket} />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/' element={<UserLogin />} />q
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;