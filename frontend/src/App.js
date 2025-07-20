import React from 'react';
import SearchBar from './SearchBar';

function App() {
  const handleSearch = (query) => {
    // TODO: Implement search logic to backend
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="App">
      <h1>Requestify</h1>
      <p>Welcome to Requestify! Search and request your favorite Spotify tracks.</p>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default App;
