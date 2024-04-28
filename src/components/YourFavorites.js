import React, { useState, useEffect } from 'react';
import axios from 'axios';
import deleteIcon from '../asset/delete-icon.png';
import closeIcon from '../asset/close-icon.png';

function YourFavorites({ onClose }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8082/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFavorites(response.data.favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handleRemoveFromFavorites = async (trackId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8082/api/favorites/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    trackId: trackId
                }
            });
            fetchFavorites();  // Refresh the list of favorites
        } catch (error) {
            console.error('Error removing track from favorites:', error);
        }
    };

    return (
        <div className="playlist-popup-overlay">
            <div className="fav-popup">
                <img src={closeIcon} alt="Close" className="close-icon" onClick={onClose} />
                <div className="favorite-content">
                    <h2>Your Favorites</h2>
                    <ul>
                        {favorites.map(track => (
                            <li key={track.TrackId} onClick={() => { }}>
                                <img
                                    src={track.AlbumImageUrl}
                                    alt="Cover"
                                    style={{ width: '70px', height: '70px', marginRight: '30px' }}
                                />
                                <div className="track-info">
                                    <div className="track-title">
                                        {track.TrackName}
                                        <span className="album-name">{track.AlbumName}</span>
                                        <span className="artist-name">{track.ArtistName}</span>
                                    </div>
                                    <img
                                        src={deleteIcon}
                                        alt="Delete"
                                        className="delete-icon-fav"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent further propagation of the current event
                                            handleRemoveFromFavorites(track.TrackId);
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default YourFavorites;
