import React, { useState } from 'react';

function SearchBar({ tracks, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== '') {
      setIsSearching(true);
      onSearch(value);
    } else {
      setIsSearching(false);
    }
  };
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by Track, Artist, or Album"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
