import React, { useState, useEffect } from 'react';
import logo from '../asset/TrackTraverseLogo.png';
import Login from './Login';
import SignUp from './SignUp';
import axios from 'axios';

function TopBar() {
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleSignUpClick = () => {
    setShowSignUpPopup(true);
  };

  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking for token in local storage)
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogoutClick = async () => {
    localStorage.token = ""
    window.location.reload();
  };


  return (
    <div>
      <div className="topbar-container">
        <div className="topbar-left">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title">Track Traverse</span>
        </div>
        <div className="topbar-right">
          {loggedIn ? (
            <button className="signup-btn" onClick={handleLogoutClick}>Logout</button>
          ) : (
            <>
              <button className="signup-btn" onClick={handleSignUpClick}>SignUp</button>
              <button className="signup-btn" onClick={handleLoginClick}>Login</button>
            </>
          )}
        </div>
      </div>
      {showSignUpPopup && <SignUp onClose={() => setShowSignUpPopup(false)} />}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default TopBar;