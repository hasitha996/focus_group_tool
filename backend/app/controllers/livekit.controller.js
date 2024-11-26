const dotenv = require('dotenv');
dotenv.config();

let AccessToken;

(async () => {
  // Dynamically import the AccessToken from livekit-server-sdk
  ({ AccessToken } = await import('livekit-server-sdk'));
})();

// Function to generate a token for a given room and user identity with a specified role
const generateToken = (roomId, identity, role) => {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_SECRET_KEY,
    { identity }
  );

  // Add the necessary permissions to the token based on the user's role
  token.addGrant({
    room: roomId,
    roomJoin: true,
    canPublish: role !== 'observer',
    canSubscribe: true,
    canPublishData: role === 'admin' || role === 'moderator',
  });

  return token.toJwt();
};

// Express endpoint to create and return the token
exports.getToken = (req, res) => {
  const { roomId, userRole, userId = 'anonymous' } = req.body;

  // Validate input parameters
  if (!roomId || !userRole) {
    return res.status(400).json({ error: 'roomId and userRole are required' });
  }

  try {
    // Generate the token
    const token = generateToken(roomId, userId, userRole);
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
