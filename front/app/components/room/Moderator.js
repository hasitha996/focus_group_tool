"use client";
import { useState, useEffect } from 'react';

const Moderator = () => {
  const [participants, setParticipants] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const toggleAudio = (participant) => {
    // Mute or unmute participant's audio
    console.log(`Toggling audio for ${participant.identity}`);
  };

  const toggleVideo = (participant) => {
    // Stop or start participant's video
    console.log(`Toggling video for ${participant.identity}`);
  };

  useEffect(() => {
    // Initialize moderator-specific settings  
    console.log('Moderator connected to the room');
  }, []);

  return (
    <div>
      <h4>Moderator Controls</h4>
      <div>
        <h5>Participants</h5>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              {participant.identity}
              <button onClick={() => toggleAudio(participant)}>
                {audioEnabled ? 'Mute' : 'Unmute'}
              </button>
              <button onClick={() => toggleVideo(participant)}>
                {videoEnabled ? 'Stop Video' : 'Start Video'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {/* Render moderator's video stream */}
        <video id="moderator-video" autoPlay muted></video>
      </div>
    </div>
  );
};

export default Moderator;
