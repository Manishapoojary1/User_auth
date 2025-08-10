import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  // <-- Import Toaster
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignupPage';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
