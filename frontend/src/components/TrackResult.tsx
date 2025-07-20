import React from 'react';
import { Track } from '../models/Track';

interface TrackResultProps {
  track: Track;
  onRequest: (track: Track) => void;
}

const TrackResult: React.FC<TrackResultProps> = ({ track, onRequest }) => {
  return (
    <li style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '8px 0', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <img
        src={track.image || 'https://via.placeholder.com/64'}
        alt={track.name}
        style={{ width: 64, height: 64, borderRadius: '6px', marginRight: '16px', objectFit: 'cover' }}
      />
      <div style={{ flex: 1 }}>
        <strong>{track.name}</strong><br />
        <span>{track.artist}</span>
      </div>
      <button
        onClick={() => onRequest(track)}
        style={{ padding: '8px 16px', fontSize: '15px', borderRadius: '4px', background: '#1db954', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Request
      </button>
    </li>
  );
};

export default TrackResult;
