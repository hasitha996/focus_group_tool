"use client";
import { useEffect, useState } from 'react';

const Participant = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    // Handle toggling audio stream with LiveKit API
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    // Handle toggling video stream with LiveKit API
  };

  useEffect(() => {
    // Initialize participant-specific settings
    console.log('Participant connected to the room');
  }, []);

  return (
    <div>
      <h4>Participant Controls</h4>
      <button onClick={toggleAudio}>
        {audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
      </button>
      <button onClick={toggleVideo}>
        {videoEnabled ? 'Stop Video' : 'Start Video'}
      </button>
      <div>
        {/* Render participant's video stream */}
        <video id="participant-video" autoPlay muted></video>
      </div>
    </div>
  );
};

export default Participant;
