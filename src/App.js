import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './components/TopBar';
import Sidebar from './components/SideBar';
import SearchBar from './components/SearchBar';
import SelectPlaylistComponent from './components/SelectPlaylist';
import AddToPlaylistPopup from './components/AddToPlaylistPopUp';
import addIcon from './asset/AddToPlaylistIcon.png';
import explicitIcon from './asset/ExplicitIcon.png';

function App() {
  const [music, setMusic] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showAddToPlaylistPopup, setShowAddToPlaylistPopup] = useState(false);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items to display per page

  useEffect(() => {
    async function fetchMusic() {
      try {
        const response = await axios.get('http://localhost:8081/api/music');
        setMusic(response.data);
        setFilteredMusic(response.data); // Initialize filtered music with all music
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    }

    async function fetchPlaylists() {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8081/api/playlists', {
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
                <div className='explicit-icon-container'>
                  {song.Explicit === 1 && <img src={explicitIcon} alt="Explicit" className='explicit-icon' />}
                </div>
                {song.TrackName}
              </h2>
              <h3>{song.AlbumName}</h3>
              <div className="add-to-playlist" onClick={() => handleAddToPlaylistClick(song.TrackId)}>
                <img src={addIcon} alt="Add to Playlist" />
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
      <nav>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(filteredMusic.length / itemsPerPage) }, (_, i) => (
            <li key={i} className='page-item'>
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
