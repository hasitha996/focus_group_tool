"use client";
import { useEffect } from 'react';

const Observer = () => {
  useEffect(() => {
    // Initialize observer-specific settings  
    console.log('Observer connected to the room');
  }, []);

  return (
    <div>
      <h4>Observer Mode</h4>
      <p>You can only view and listen to moderators and other observers.</p>
      <div>
        {/* Render observer's view of the moderator's video */}
        <video id="moderator-video" autoPlay muted></video>
      </div>
    </div>
  );
};

export default Observer;
