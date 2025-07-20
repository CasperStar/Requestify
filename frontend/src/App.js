import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

function App() {
  const [tracks, setTracks] = useState([
    { id: '1', name: 'Track One', artist: 'Artist A', image: 'https://via.placeholder.com/64?text=Track+1' },
    { id: '2', name: 'Track Two', artist: 'Artist B', image: 'https://via.placeholder.com/64?text=Track+2' },
    { id: '3', name: 'Track Three', artist: 'Artist C', image: 'https://via.placeholder.com/64?text=Track+3' }
  ]);

  const handleSearch = (query) => {
    // TODO: Implement search logic to backend
    // For now, just show all dummy tracks
    setTracks([
      { id: '1', name: 'Track One', artist: 'Artist A', image: 'https://via.placeholder.com/64?text=Track+1' },
      { id: '2', name: 'Track Two', artist: 'Artist B', image: 'https://via.placeholder.com/64?text=Track+2' },
      { id: '3', name: 'Track Three', artist: 'Artist C', image: 'https://via.placeholder.com/64?text=Track+3' }
    ]);
  };

  const handleRequest = (track) => {
    alert(`Requested: ${track.name} by ${track.artist}`);
  };

  return (
    <div className="App">
      <h1>Requestify</h1>
      <p>Welcome to Requestify! Search and request your favorite Spotify tracks.</p>
      <SearchBar onSearch={handleSearch} />
      <SearchResults tracks={tracks} onRequest={handleRequest} />
    </div>
  );
}

export default App;
