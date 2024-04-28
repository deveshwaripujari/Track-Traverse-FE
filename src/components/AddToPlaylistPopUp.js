import React, { useState, useEffect } from 'react';
import axios from 'axios';
import playlistIcon from '../asset/AddToPlaylistIcon.png'; // Ensure this path is correct

function AddToPlaylistPopup({ trackId, onClose, onSelectPlaylist }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/playlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPlaylists(response.data);
    };

    fetchUserPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId, trackId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8082/api/playlists/add-track', {
        playlistId,
        trackId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Track ${trackId} added to playlist ${playlistId}`);
      onClose(); // Close the popup after adding
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      alert("Error adding track to playlist !")
    }
  };

  const handleSelectPlaylist = (playlistId) => {
    setShowCreateForm(false);
    handleAddToPlaylist(playlistId, trackId);
  };

  const handleCreateNewPlaylist = () => {
    setShowCreateForm(true);
  };

  const handleSubmitNewPlaylist = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8082/api/create-playlists', {
        playlistName: newPlaylistName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newPlaylistId = response.data.playlistId;
      setUserPlaylists([...userPlaylists, { playlist_id: newPlaylistId, playlist_name: newPlaylistName }]);
      handleAddToPlaylist(newPlaylistId, trackId);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <div className='popup-content'>
          <div className='popup-header'>
            <button className='close-button' onClick={onClose}>X</button>
          </div>
          <div className='popup-options'>
            <button onClick={() => setShowCreateForm(false)}>Select Playlist</button>
            <button onClick={handleCreateNewPlaylist}>Create New Playlist</button>
          </div>
          {showCreateForm ? (
            <div className='create-form'>
              <input
                type='text'
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder='Enter playlist name'
              />
              <button onClick={handleSubmitNewPlaylist}>Create</button>
            </div>
          ) : (
            <ul className="user-playlists-ul">
              {userPlaylists.map(playlist => (
                <li key={playlist.playlist_id} onClick={() => handleSelectPlaylist(playlist.playlist_id)}>
                  <img src={playlistIcon} alt="Playlist Icon" className="playlist-icon" />
                  <div className='playlist-name'>
                    {playlist.playlist_name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddToPlaylistPopup;
