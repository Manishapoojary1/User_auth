import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Correct API endpoint and correct request body
      const response = await axios.post('http://localhost:4000/api/auth/login', 
        { email, password }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Logged in successfully 🎉');

        // Now fetch user data to get isAccountVerified
        const userDataResponse = await axios.get('http://localhost:4000/api/user/data', { withCredentials: true });

        if (userDataResponse.data.success) {
          const { isAccountVerified } = userDataResponse.data.userData;

          // Set Auth Context
          setAuthState({
            isLoggedIn: true,
            isEmailVerified: isAccountVerified
          });

          navigate('/home');
        } else {
          toast.error('Failed to fetch user data');
        }

      } else {
        toast.error(response.data.message || 'Login failed');
      }

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <a onClick={() => navigate('/reset-password')} style={{ cursor: 'pointer' }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="bottom-text">
          Don’t have an account?{' '}
          <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
