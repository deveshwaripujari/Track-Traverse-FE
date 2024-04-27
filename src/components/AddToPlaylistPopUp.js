import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddToPlaylistPopup({ trackId, onClose, onSelectPlaylist, onCreateNewPlaylist }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null); // Added state for selected track ID

  useEffect(() => {
    // No initial fetch here, we'll fetch playlists only when needed
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/playlists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const handleSelectPlaylist = async (playlistId) => {
    setShowCreateForm(false);
    try {
      await fetchUserPlaylists();
      onSelectPlaylist(playlistId);
      console.log("trackID : ", trackId)
      console.log("playlistID : ", playlistId)
      if (trackId && playlistId) {
        handleAddToPlaylist(playlistId, trackId); // Call handleAddToPlaylist when both track and playlist are selected
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const handleCreateNewPlaylist = async () => {
    setShowCreateForm(true);
  };

  const handleSubmitNewPlaylist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8081/api/create-playlists',
        { playlistName: newPlaylistName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUserPlaylists([...userPlaylists, { id: response.data.playlistId, playlist_name: newPlaylistName }]);
      onSelectPlaylist(response.data.playlistId);
      if (selectedTrackId) {
        handleAddToPlaylist(response.data.playlistId, selectedTrackId); // Call handleAddToPlaylist when track is selected after creating a new playlist
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
    setNewPlaylistName('');
    setShowCreateForm(false);
    onClose();
  };

  const handleAddToPlaylist = async (playlistId, trackId) => {
    try {
        // console.log('Hello')
        console.log(playlistId, trackId)
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8081/api/playlists/add-track',
        { playlistId, trackId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Track added to playlist successfully
    } catch (error) {
      console.error('Error adding track to playlist:', error);
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
            <button onClick={handleSelectPlaylist}>Select Playlist</button>
            <button onClick={handleCreateNewPlaylist}>Create New Playlist</button>
          </div>
          {showCreateForm && (
            <div className='create-form'>
              <input
                type='text'
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder='Enter playlist name'
              />
              <button onClick={handleSubmitNewPlaylist}>Create</button>
            </div>
          )}
          {userPlaylists.length > 0 && !showCreateForm && (
            <div className='user-playlists'>
              <h3>Your Playlists</h3>
              <ul>
                {userPlaylists.map(playlist => (
                  <li key={playlist.playlist_id} onClick={() => handleSelectPlaylist(playlist.playlist_id)}>
                    {playlist.playlist_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddToPlaylistPopup;
