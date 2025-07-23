const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper: Load user access token from tokens.json
function getUserAccessToken() {
  const tokensPath = path.resolve(__dirname, 'tokens.json');
  try {
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    return tokens.access_token;
  } catch (err) {
    return null;
  }
}

// Spotify OAuth endpoints
app.get('/login', (req, res) => {
  const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
  ];
  const params = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: Math.random().toString(36).substring(2, 15)
  });
  res.redirect('https://accounts.spotify.com/authorize?' + params);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  if (!code) return res.status(400).send('Missing code');
  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token',
      querystring.stringify({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // Save tokens to tokens.json
    const tokensPath = path.resolve(__dirname, 'tokens.json');
    const tokens = {
      access_token: tokenRes.data.access_token,
      refresh_token: tokenRes.data.refresh_token,
      expires_in: tokenRes.data.expires_in,
      obtained_at: Date.now()
    };
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2), 'utf8');
    res.json({
      ...tokens,
      message: 'Tokens saved to tokens.json file.'
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to get tokens');
  }
});

// Helper: Get Spotify access token
async function getSpotifyToken() {
  const resp = await axios.post('https://accounts.spotify.com/api/token',
    'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      }
    });
  return resp.data.access_token;
}

// Search endpoint
app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
    const token = await getSpotifyToken();
    const resp = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10 }
    });
    const tracks = resp.data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      image: track.album.images[0]?.url,
      preview_url: track.preview_url
    }));
    res.json(tracks);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Spotify API error' });
  }
});


// Add to playlist endpoint
app.post('/add-to-playlist', async (req, res) => {
  const { trackUri } = req.body;
  const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
  if (!trackUri) return res.status(400).json({ error: 'Missing trackUri' });
  if (!playlistId) return res.status(500).json({ error: 'Missing playlist ID' });
  const userToken = getUserAccessToken();
  if (!userToken) {
    return res.status(500).json({ error: 'User access token not found. Please authenticate via /login.' });
  }
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [trackUri] },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
