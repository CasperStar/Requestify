import React from 'react';
import TrackResult from './TrackResult';

function SearchResults({ tracks, onRequest }) {
  if (!tracks || tracks.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>No tracks found.</div>;
  }

  return (
    <div style={{ margin: '20px auto', maxWidth: '600px' }}>
      <h2>Search Results</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tracks.map((track, idx) => (
          <TrackResult key={track.id || idx} track={track} onRequest={onRequest} />
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
