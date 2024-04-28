import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectPlaylistComponent({ trackId }) {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8082/api/playlists', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(response => setPlaylists(response.data))
            .catch(error => console.error('Error fetching playlists:', error));
    }, []);

    const handleAddToPlaylist = () => {
        if (!selectedPlaylist) {
            alert("Please select a playlist");
            return;
        }
        axios.post('http://localhost:8082/api/playlists/add-track', {
            playlistId: selectedPlaylist,
            trackId: trackId
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => alert("Track added to playlist successfully"))
            .catch(error => console.error('Error adding track to playlist:', error));
    };

    return (
        <div>
            <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                <option value="">Select a playlist</option>
                {playlists.map(playlist => (
                    <option key={playlist.playlist_id} value={playlist.playlist_id}>
                        {playlist.playlist_name}
                    </option>
                ))}
            </select>
            <button onClick={handleAddToPlaylist}>Add to Playlist</button>
        </div>
    );
}

export default SelectPlaylistComponent;
