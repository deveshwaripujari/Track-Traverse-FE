import React, { useState, useEffect } from 'react';
import axios from 'axios';
import deleteIcon from '../asset/delete-icon.png'
import closeIcon from '../asset/close-icon.png'
import playlistIcon from '../asset/playlist-icon.png'

function YourPlaylist({ onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    // This useEffect runs whenever playlists state changes
    if (selectedPlaylist && playlists.length > 0) {
      // Check if selectedPlaylist is still in playlists after deletion
      const playlistExists = playlists.some(playlist => playlist.playlist_id === selectedPlaylist);
      if (!playlistExists) {
        // If selectedPlaylist doesn't exist anymore, reset it
        setSelectedPlaylist(null);
        setTracks([]);
      }
    }
  }, [playlists, selectedPlaylist]);

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/playlists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8082/api/playlists/tracks/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedPlaylist(playlistId);
      setTracks(response.data.tracks);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      // Make a DELETE request to the server to delete the playlist
      await axios.delete(`http://localhost:8082/api/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After successfully deleting the playlist, fetch the updated list of playlists
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleDeleteTrack = async (trackId, playlistId) => {
    try {
      const token = localStorage.getItem('token');
      // Make a DELETE request to the server to delete the track from the playlist
      await axios.delete(`http://localhost:8082/api/deleteTrack`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          trackId: trackId,
          playlistId: playlistId
        }
      });
      // After successfully deleting the track, you may want to update the list of tracks
      // For example, you could refetch the tracks for the currently selected playlist
      // or update the local state of tracks if it's feasible
      handlePlaylistClick(playlistId)
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  return (
    <div className="playlist-popup-overlay">
      <div className="playlist-popup">
        <img src={closeIcon} alt="Close" className="close-icon" onClick={onClose} />
        <div className="playlist-content">
          <h2>Your Playlists</h2>
          <ul>
            {playlists && playlists.map(playlist => (
              <li key={playlist.playlist_id} onClick={() => handlePlaylistClick(playlist.playlist_id)}>
                <img
                  src={playlistIcon}
                  alt="Cover"
                  style={{ width: '60px', height: '40px', marginRight: 0 }}
                />
                <div className="playlist-title">
                  {playlist.playlist_name || "Unknown Playlist"}
                </div>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="delete-icon-pl"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the handlePlaylistClick from being triggered
                    handleDeletePlaylist(playlist.playlist_id); // Call a function to delete the playlist
                  }}
                />
              </li>
            ))}
          </ul>
          {/* <button onClick={onClose}>Close</button> */}
        </div>
        {selectedPlaylist && playlists.some(playlist => playlist.playlist_id === selectedPlaylist) && (
          <div className="playlist-tracks">
            <h2>
              Tracks in {playlists.find(playlist => playlist.playlist_id === selectedPlaylist)?.playlist_name || "Unknown Playlist"}
            </h2>
            <ul>
              {tracks.map(track => (
                <li key={track.TrackId} className="track-item">
                  <img src={track.AlbumImageUrl} alt={track.TrackName} className="album-cover" />
                  <div className="track-info">
                    <div className="track-title">
                      {track.TrackName}
                      <span className="album-name">{track.AlbumName}</span>
                      <span className="artist-name">{track.ArtistName}</span>
                    </div>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className='delete-icon-pl-tr'
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the handlePlaylistClick from being triggered
                        handleDeleteTrack(track.TrackId, selectedPlaylist); // Pass trackId and playlistId
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default YourPlaylist;
