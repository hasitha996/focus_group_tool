import { Room, VideoTrack, AudioTrack, LocalParticipant, RemoteParticipant } from 'livekit-client';
let room;
let localParticipant;

// Connect to LiveKit Room
export const connectToRoom = async (roomId, userRole) => {
  try {
 
    const livekitUrl = process.env.LIVEKIT_URL; 
    const token = await fetchToken(roomId, userRole); 

    // Connect to the room
    room = await Room.connect(livekitUrl, token);

    // Initialize the local participant
    localParticipant = room.localParticipant;

    // Handle different roles
    handleRole(userRole);

    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);
    
    console.log(`Connected to room: ${roomId}`);
  } catch (error) {
    console.error('Error connecting to room:', error);
  }
};

// Fetch token for user (from backend or API)
const fetchToken = async (roomId, userRole) => {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({ roomId, userRole }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data.token;
};

// Handle user roles: admin, participant, moderator, observer
const handleRole = (role) => {
  if (role === 'admin') {
    // Admins can hear and speak to all participants
    localParticipant.setMicrophoneEnabled(true);
    localParticipant.setCameraEnabled(true);
  }

  if (role === 'moderator') {
    // Moderators can listen and talk to all participants
    localParticipant.setMicrophoneEnabled(true);
    localParticipant.setCameraEnabled(true);
  }

  if (role === 'participant') {
    // Participants can talk to all other participants and moderators
    localParticipant.setMicrophoneEnabled(true);
    localParticipant.setCameraEnabled(true);
  }

  if (role === 'observer') {
    // Observers cannot talk to anyone, can only listen
    localParticipant.setMicrophoneEnabled(false);
    localParticipant.setCameraEnabled(false);
  }
};

// Handle new participant connection
const handleParticipantConnected = (participant) => {
  console.log(`New participant connected: ${participant.identity}`);
  
  // Show their tracks
  participant.tracks.forEach((publication) => {
    if (publication.track) {
      document.getElementById('remoteTracks').appendChild(publication.track.attach());
    }
  });

  participant.on('trackSubscribed', (track) => {
    if (track) {
      document.getElementById('remoteTracks').appendChild(track.attach());
    }
  });
};

// Handle participant disconnection
const handleParticipantDisconnected = (participant) => {
  console.log(`Participant disconnected: ${participant.identity}`);
  
  // Cleanup the remote track when a participant leaves
  participant.tracks.forEach((publication) => {
    if (publication.track) {
      publication.track.detach();
    }
  });
};

// Publish video and audio tracks
export const publishTracks = async () => {
  const audioTrack = new AudioTrack(); // Create an audio track (from microphone)
  const videoTrack = new VideoTrack(); // Create a video track (from camera)

  localParticipant.publishTrack(audioTrack);
  localParticipant.publishTrack(videoTrack);
};

// Disconnect from the room
export const disconnectFromRoom = () => {
  if (room) {
    room.disconnect();
    console.log('Disconnected from room');
  }
};
