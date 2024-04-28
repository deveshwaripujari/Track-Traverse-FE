import React, { useState } from 'react';
import axios from 'axios';

function Login({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8082/api/login', { email, password });
      const token = response.data.token;
      console.log('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Store token in local storage or session storage
      localStorage.setItem('token', token);
      console.log('Login successful');
      onClose(); // Close the popup after successful login
      window.location.reload();
    } catch (error) {
      console.error('Login Error:', error.response.data.error);
      alert("Login Failure. Try again !")
    }
  };

  return (
    <div className="signup-modal">
      <div className="signup-modal-content">
        <h2 className="signup-title">Login</h2>
        <p>Please login to continue.</p>
        <input className='signup-input' type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className='signup-input' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="signup-btn" onClick={handleLogin}>Login</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Login;
