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

  const handleSearch = async (query: string) => {
    try {
      const res = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      // Map backend response to Track model
      const mappedTracks: Track[] = data.map((track: any) => ({
        id: track.id,
        name: track.title,
        artist: track.artist,
        image: track.image || '',
      }));
      setTracks(mappedTracks);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setTracks([]);
    }
  };

  const handleRequest = async (track: Track) => {
    // Construct the Spotify track URI
    const trackUri = `spotify:track:${track.id}`;
    try {
      const res = await fetch('http://localhost:5000/add-to-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackUri })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Added to playlist: ${track.name} by ${track.artist}`);
      } else {
        alert(`Failed to add to playlist: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error: Could not add to playlist');
    }
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
