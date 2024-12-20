// app/api/delete-room/route.js
import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

export async function DELETE(request) {
  const { roomId } = await request.json();

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  try {
    const apiUrl = process.env.LIVEKIT_API_URL || '';
    const apiKey = process.env.LIVEKIT_API_KEY || '';
    const apiSecret = process.env.LIVEKIT_API_SECRET || '';

    // Initialize RoomServiceClient with LiveKit credentials
    const roomService = new RoomServiceClient(apiUrl, apiKey, apiSecret);
    await roomService.deleteRoom(roomId);

    return NextResponse.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
