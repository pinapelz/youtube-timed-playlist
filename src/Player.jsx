import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

const formatTimeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

function PlaylistDisplay({ playlist }) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Playlist</h2>
      <div>
        {playlist.map((item, index) => {
          const [videoId, startTime, endTime] = item.split(',');

          return (
            <div key={index} className="mb-2">
              <p>
                <a
                  href={`https://youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`https://youtube.com/${videoId} (Start: ${startTime}, End: ${endTime})`}
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VanillaYTPlayer({ playlist, currentVideoIndex }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (currentVideoIndex >= 0 && currentVideoIndex < playlist.length) {
      const [videoId, startTime, endTime] = playlist[currentVideoIndex].split(',');

      const videoStartTime = formatTimeToSeconds(startTime);
      const videoEndTime = formatTimeToSeconds(endTime);

      if (playerRef.current) {
        playerRef.current.loadVideoById({
          videoId,
          startSeconds: videoStartTime,
          endSeconds: videoEndTime,
        });
        console.log('Video loaded. Seeking to start time. ' + videoStartTime + ' seconds');
        setTimeout(() => {
          playerRef.current.seekTo(videoStartTime);
        }, 300);
      }
    }
  }, [currentVideoIndex, playlist]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, [currentVideoIndex, playlist]);

  return (
    <div>
      {/* The <iframe> (and video player) will replace this <div> tag. */}
      <div id="player">
        <YouTube
          videoId=""
          opts={{
            height: '390',
            width: '640',
            playerVars: {
              playsinline: 1,
            },
          }}
          onReady={(event) => {
            playerRef.current = event.target;
            console.log('Player is ready.');
            // sleep for 3 
          }}
        />
      </div>
    </div>
  );
}

function Player() {
  const [playlistBase64, setPlaylistBase64] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (playlistBase64) {
      try {
        const decodedPlaylist = atob(playlistBase64);
        const playlistItems = decodedPlaylist.split('$');
        setPlaylist(playlistItems);
      } catch (error) {
        console.error('Error decoding Base64 playlist:', error);
      }
    }
  }, [playlistBase64]);

  useEffect(() => {
    if (currentVideoIndex >= 0 && currentVideoIndex < playlist.length) {
      const [_, __, endTime] = playlist[currentVideoIndex].split(',');
      const videoEndTime = formatTimeToSeconds(endTime);

      // Set a timeout to play the next video when the current video ends.
      const timeoutId = setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
        console.log('Video ended. Playing next video.');
        console.log('Current video index: ' + currentVideoIndex);
      }, (videoEndTime - currentTime) * 1000); // Convert to milliseconds

      return () => {
        // Clear the timeout if the component unmounts or the video changes.
        clearTimeout(timeoutId);
      };
    }
  }, [currentVideoIndex, playlist, currentTime]);

  const playNextVideo = () => {
    if (currentVideoIndex < playlist.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const resetPlayer = () => {
    setCurrentVideoIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <VanillaYTPlayer
        playlist={playlist}
        currentVideoIndex={currentVideoIndex}
      />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-4 my-5">
        <h1 className="text-2xl font-bold mb-4">Player</h1>
        <div className="mb-4">
          <label
            htmlFor="playlistBase64"
            className="block text-sm font-medium text-gray-600"
          >
            Enter Base64 Playlist:
          </label>
          <textarea
            id="playlistBase64"
            value={playlistBase64}
            onChange={(e) => setPlaylistBase64(e.target.value)}
            className="mt-1 p-2 border rounded-lg w-full h-32"
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={resetPlayer}
        >
          Load
        </button>
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-4 my-5">
        <h2 className="text-xl font-bold mb-4">Current Playtime</h2>
        <p>{`Current Time: ${currentTime.toFixed(2)} seconds`}</p>
      </div>

      <PlaylistDisplay playlist={playlist} />
    </div>
  );
}

export default Player;
