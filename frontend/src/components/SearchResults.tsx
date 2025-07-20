import React from 'react';
import { Track } from '../models/Track';
import TrackResult from './TrackResult';

interface SearchResultsProps {
  tracks: Track[];
  onRequest: (track: Track) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ tracks, onRequest }) => {
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
};

export default SearchResults;
