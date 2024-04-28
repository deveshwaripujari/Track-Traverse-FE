import React from 'react';
import axios from 'axios';

function AddToFavoritesPopup({ trackId, onClose }) {
    const handleAddToFavorites = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8082/api/favorites/add', {
                trackId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Track ${trackId} added to favorites`);
            onClose(); // Close the popup after adding successfully
        } catch (error) {
            console.error('Error adding track to favorites:', error);
            alert("Error adding track to favorites!");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-content">
                    <div className='popup-header'>
                        <button className='close-button' onClick={onClose}>X</button>
                    </div>
                    <h2>Add to Favorites</h2>
                    <p>Are you sure you want to add this track to your favorites?</p>
                    <button onClick={handleAddToFavorites}>Add to Favorites</button>
                </div>
            </div>
        </div>
    );
}

export default AddToFavoritesPopup;
