import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  const role = req.nextUrl.searchParams.get("role") || "participant"; 

  // Validate required parameters
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  // Check for valid role
  const validRoles = ["admin", "moderator", "participant", "observer"];
  if (!validRoles.includes(role)) {
    return NextResponse.json(
      { error: 'Invalid "role" query parameter. Allowed values are: admin, moderator, participant, observer.' },
      { status: 400 }
    );
  }

  // Retrieve environment variables
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured. Please check your environment variables." },
      { status: 500 }
    );
  }

  // Create the AccessToken with metadata
  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    metadata: JSON.stringify({ role }), // Include role in metadata
  });

  // Add grants based on the role
  switch (role) {
    case "admin":
      at.addGrant({
        room:room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        roomAdmin: true,
        roomCreate: true,
      });
      break;

    case "moderator":
      at.addGrant({
        room:room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });
      break;

    case "participant":
      at.addGrant({
        room:room,
        roomJoin: true,
        canSubscribe: true,
      });
      break;

    case "observer":
      at.addGrant({
        room:room,
        roomJoin: true,
        canSubscribe: false,
      });
      break;

    default:
      return NextResponse.json(
        { error: 'Role is required and must be one of: admin, moderator, participant, observer.' },
        { status: 400 }
      );
  }

  // Return the generated token and room name
  return NextResponse.json({ token: at.toJwt(),  room:room });
}
