import React, { useState } from 'react';
import axios from 'axios';

function CreatePlaylistPopup({ onClose, onCreate }) {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (playlistName.trim() !== '') {
      const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
      axios.post('http://localhost:8082/api/create-playlists', { playlistName }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Playlist created:', response.data);
          onClose(); // Close the popup on successful creation
        })
        .catch(error => {
          console.error('Error creating playlist:', error.response ? error.response.data : 'No response');
          alert('Failed to create playlist: ' + (error.response ? error.response.data.error : 'No response'));
        });
    } else {
      alert('Please enter a playlist name');
    }
  };

  return (
    <div className='Create-playlist'>
      <div className='popup-overlay'> {/* Container for dimming background */}
        <div className='popup'>
          <div className='popup-content'>
            <h2>Create Playlist</h2>
            <input
              type='text'
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder='Enter playlist name'
            />
            <div className='popup-buttons'>
              <button onClick={handleCreatePlaylist}>Create</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePlaylistPopup;
