import React, { useState } from 'react';
import axios from 'axios';

function SignUp({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await axios.post('http://localhost:8082/api/signup', { email, password });
      console.log('User signed up successfully');
      onClose(); // Close the popup after successful signup
    } catch (error) {
      console.error('Signup Error:', error.response.data.error);
      alert("Signup failed !")
    }
  };

  return (
    <div className="signup-modal">
      <div className="signup-modal-content">
        <h2 className="signup-title">Sign Up</h2>
        <input className="signup-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="signup-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SignUp;
