import React, { useState, useEffect } from 'react';

function Maker() {
  const [playlist, setPlaylist] = useState([]);
  const [url, setUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [playlistString, setPlaylistString] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const formattedPlaylist = playlist.map((item) => {
      const start = item.startTime === 'Full' ? 'Full' : formatSecondsToTime(item.startTime);
      const end = item.endTime === 'Full' ? 'Full' : formatSecondsToTime(item.endTime);
      return `${item.url},${start},${end}`;
    });

    // Join the formatted playlist with '$'
    const playlistStr = formattedPlaylist.join('$');

    setPlaylistString(playlistStr);
  }, [playlist]);

  const addToPlaylist = () => {
    const url_id = extractVideoIdFromUrl(url);
    if (url_id) {
      const startTimeInSeconds = startTime ? formatTimeToSeconds(startTime) : 'Full';
      const endTimeInSeconds = endTime ? formatTimeToSeconds(endTime) : 'Full';

      const newItem = {
        url: url_id,
        startTime: startTimeInSeconds,
        endTime: endTimeInSeconds,
      };

      setPlaylist([...playlist, newItem]);
      setUrl('');
      setStartTime('');
      setEndTime('');
    } else {
      // Handle invalid URL input
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }
  };

  const extractVideoIdFromUrl = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substr(1);
    }
    return null;
  };

  const removeItem = (index) => {
    const updatedPlaylist = [...playlist];
    updatedPlaylist.splice(index, 1);
    setPlaylist(updatedPlaylist);
  };

  const formatTimeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const encodeToBase64 = (text) => {
    const utf8Bytes = new TextEncoder().encode(text);
    return btoa(String.fromCharCode(...utf8Bytes));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold mb-4">Create Your Playlist</h1>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-600">
            URL:
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 p-2 border rounded-lg w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-600">
            Start Time (HH:MM:SS):
          </label>
          <input
            type="text"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 p-2 border rounded-lg w-full"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-600">
            End Time (HH:MM:SS):
          </label>
          <input
            type="text"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 p-2 border rounded-lg w-full"
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={addToPlaylist}
        >
          Add to Playlist
        </button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Your Playlist</h2>
        <ul>
          {playlist.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {item.url}
              </a>{' '}
              (Start: {item.startTime}, End: {item.endTime})
              <button
                onClick={() => removeItem(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md mt-4">
        <h2 className="text-xl font-bold mb-2">Playlist as Text</h2>
        <textarea
          value={playlistString}
          readOnly
          className="p-2 border rounded-lg w-full h-32"
        />
      </div>

      <div className="w-full max-w-md mt-4">
        <h2 className="text-xl font-bold mb-2">Playlist as Base64</h2>
        <textarea
          value={encodeToBase64(playlistString)}
          readOnly
          className="p-2 border rounded-lg w-full h-32"
        />
      </div>
    </div>
  );
}

export default Maker;
