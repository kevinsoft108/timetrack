import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import UserHeader from './components/UserHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import Timetrack from './pages/Timetrack';
import Landing from './pages/subcomponents/Landing';
import UserLogin from './pages/userLogin';
import UserRegister from './pages/userRegister';
import Dashboard from './pages/Dashboard';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000/');

const isDev = false; // require('electron-is-dev')
const START_URL = isDev ? 'http://localhost:3006/admin' : 'http://localhost:3006';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          {START_URL === 'http://localhost:3006/admin' ? (
            <div className='container'>
              <Header />
              <Routes>
                <Route path='/' element={<Landing socket={socket} />} />
                <Route path='/timetrack' element={<Timetrack />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Routes>
            </div>
          ) : (
            <div className='container'>
              <UserHeader />
              <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/' element={<UserLogin />} />
                <Route path='/register' element={<UserRegister />} />
              </Routes>
            </div>
          )}
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;