import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './components/TopBar';
import Sidebar from './components/SideBar';
import SearchBar from './components/SearchBar';
import SelectPlaylistComponent from './components/SelectPlaylist';
import AddToPlaylistPopup from './components/AddToPlaylistPopUp';
import AddToFavoritesPopup from './components/AddToFavouritesPopUp';
import addIcon from './asset/AddToPlaylistIcon.png';
import explicitIcon from './asset/ExplicitIcon.png';
import favIcon from './asset/heart.png';

function App() {
  const [music, setMusic] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showAddToPlaylistPopup, setShowAddToPlaylistPopup] = useState(false);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items to display per page
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  useEffect(() => {
    async function fetchMusic() {
      try {
        const response = await axios.get('http://localhost:8082/api/music');
        setMusic(response.data);
        setFilteredMusic(response.data); // Initialize filtered music with all music
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    }

    async function fetchPlaylists() {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8082/api/playlists', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }

    fetchMusic();
    fetchPlaylists();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMusic.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddToPlaylistClick = (trackId) => {
    setCurrentTrackId(trackId);
    setShowAddToPlaylistPopup(true);
  };

  const handleCloseAddToPlaylistPopup = () => {
    setShowAddToPlaylistPopup(false);
  };

  const handleSelectPlaylist = (playlistId) => {
    // Implement logic to add the current track to the selected playlist
    console.log(`Track ${currentTrackId} added to playlist ${playlistId}`);
  };

  const handleCreateNewPlaylist = (newPlaylistName) => {
    // Implement logic to create a new playlist with the given name and add the current track to it
    console.log(`New playlist created: ${newPlaylistName}`);
    setShowAddToPlaylistPopup(false); // Close the Add To Playlist Popup
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      // Handle empty search term by resetting to original full list, or setting a default state
      setTimeout(() => {
        setFilteredMusic(music); // Assuming `music` is your full list
        setCurrentPage(1);
      }, 200);
      return;
    }

    // Filter music based on the search term
    const filtered = music.filter((song) => {
      const { TrackName, ArtistName, AlbumName } = song;
      const normalizedSearchTerm = searchTerm.toLowerCase();
      return (
        TrackName.toLowerCase().includes(normalizedSearchTerm) ||
        ArtistName.toLowerCase().includes(normalizedSearchTerm) ||
        AlbumName.toLowerCase().includes(normalizedSearchTerm)
      );
    });
    // Introduce a small delay for easing effect
    setTimeout(() => {
      setFilteredMusic(filtered);
      setCurrentPage(1); // Reset to first page when searching
    }, 200); // Adjust the delay time as needed
  };

  const handleCloseFavoritesPopup = () => {
    setShowFavoritesPopup(false);
  };

  const handleAddToFavoritesClick = (trackId) => {
    setCurrentTrackId(trackId);
    setShowFavoritesPopup(true);
  };


  return (
    <div className='App'>
      <TopBar />
      <SearchBar onSearch={handleSearch} />
      <div className='app-content'>
        <Sidebar />
        <div className="music-grid">
          {currentItems.map(song => (
            <div key={song.TrackId} className="music-card">
              <img src={song.AlbumImageUrl} alt={song.TrackName} />
              <h2>
                {song.Explicit === 1 &&
                  <div className='explicit-icon-container'>
                    <img src={explicitIcon} alt="Explicit" className='explicit-icon' />
                  </div>
                }
                {song.TrackName}
              </h2>
              <h3>{song.AlbumName}</h3>
              <div className="add-to-playlist" onClick={() => handleAddToPlaylistClick(song.TrackId)}>
                <img src={addIcon} alt="Add to Playlist" />
              </div>
              <div className="favourite" onClick={() => handleAddToFavoritesClick(song.TrackId)}>
                <img src={favIcon} alt="Favourite" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPlaylistModal &&
        <SelectPlaylistComponent
          trackId={currentTrackId}
          playlists={playlists}
          onClose={() => setShowPlaylistModal(false)}
        />}
      {showAddToPlaylistPopup &&
        <AddToPlaylistPopup
          trackId={currentTrackId}
          onClose={handleCloseAddToPlaylistPopup}
          onSelectPlaylist={handleSelectPlaylist}
          onCreateNewPlaylist={handleCreateNewPlaylist}
        />}
      {showFavoritesPopup && (
        <AddToFavoritesPopup
          trackId={currentTrackId}
          onClose={handleCloseFavoritesPopup}
        />
      )}
      <nav className="pagination-nav">
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(filteredMusic.length / itemsPerPage) }, (_, i) => (
            <li key={i} className='page-item' alig>
              <button onClick={() => paginate(i + 1)} className='page-link'>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;
