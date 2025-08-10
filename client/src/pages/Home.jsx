import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);

  return (
    <div className="page-container">
      <Navbar />

      {authState.isLoggedIn && (
        <button className="top-logout-btn" onClick={() => {
          logout();
          navigate('/');
        }}>
          Logout
        </button>
      )}

      <main className="home-container">
        <div className="content">
          <h2>Hey 👋</h2>
          <h1>Welcome to our app</h1>

          {!authState.isLoggedIn && (
            <button onClick={() => navigate('/login')}>
              Login
            </button>
          )}

          {authState.isLoggedIn && !authState.isEmailVerified && (
            <button onClick={() => navigate('/email-verify')}>
              Verify Email
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
