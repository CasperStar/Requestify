import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { Track } from './models/Track';

const dummyTracks: Track[] = [
  { id: '1', name: 'Track One', artist: 'Artist A', image: 'https://via.placeholder.com/64?text=Track+1' },
  { id: '2', name: 'Track Two', artist: 'Artist B', image: 'https://via.placeholder.com/64?text=Track+2' },
  { id: '3', name: 'Track Three', artist: 'Artist C', image: 'https://via.placeholder.com/64?text=Track+3' }
];

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);

  const handleSearch = (query: string) => {
    // TODO: Implement search logic to backend
    setTracks(dummyTracks);
  };

  const handleRequest = (track: Track) => {
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
