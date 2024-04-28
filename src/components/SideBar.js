import React, { useState } from 'react';
import CreatePlaylistPopUp from './CreatePlaylistPopUp';
import Login from './Login';
import YourPlaylist from './YourPlaylist';
import YourFavorites from './YourFavorites';

function Sidebar() {

  const [showCreatePlaylistPopUp, setShowCreatePlaylistPopUp] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showYourPlaylistPopup, setShowYourPlaylistPopup] = useState(false);
  const [showYourFavoritesPopup, setShowYourFavoritesPopup] = useState(false);

  const handleCreatePlaylistClick = () => {
    // Check if user is logged in
    if (localStorage.getItem('token')) {
      setShowCreatePlaylistPopUp(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleCloseCreatePlaylistPopup = () => {
    setShowCreatePlaylistPopUp(false);
  };

  const handleCreatePlaylist = (playlistName) => {
    // Implement logic to create playlist
    console.log('Creating playlist:', playlistName);
    // Example: You can make a POST request to your API to create the playlist
  };

  const handleYourPlaylistClick = () => {
    // Check if user is logged in
    if (localStorage.getItem('token')) {
      setShowYourPlaylistPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleCloseYourPlaylistPopup = () => {
    setShowYourPlaylistPopup(false);
  };

  const handleYourFavoritesClick = () => {
    if (localStorage.getItem('token')) {
      setShowYourFavoritesPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleCloseYourFavoritesPopup = () => {
    setShowYourFavoritesPopup(false);
  };

  return (
    <div className='sidebar'>
      <h2>Menu</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><a href="#" onClick={handleYourFavoritesClick}>Your Favorites</a></li>
        <li><a href="#" onClick={handleYourPlaylistClick}>Your Playlist</a></li>
        <li><a href="#" onClick={handleCreatePlaylistClick}>Create Playlist</a></li>
      </ul>
      {showCreatePlaylistPopUp && (
        <CreatePlaylistPopUp onClose={handleCloseCreatePlaylistPopup} onCreate={handleCreatePlaylist} />
      )}
      {showYourPlaylistPopup && (
        <YourPlaylist onClose={handleCloseYourPlaylistPopup} />
      )}
      {showLoginPopup && (
        <Login onClose={handleCloseLoginPopup} />
      )}
      {showYourFavoritesPopup && (
        <YourFavorites onClose={handleCloseYourFavoritesPopup} />
      )}
    </div>
  );
}

export default Sidebar;
