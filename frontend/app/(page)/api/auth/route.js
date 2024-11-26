/* eslint-disable no-undef */
import { NextResponse } from 'next/server'
import CryptoJS from 'crypto-js'

// Handles GET requests to /api
export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}


export async function POST(req) {
  const url = req.nextUrl.clone()
  const action = url.searchParams.get('action')
  const headers = req.headers

  if (action === 'signin') {
    try {
      const { email, password } = await req.json();

      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signin`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ email, password }),
        }
      );

      // Return if signin failed
      if (!response.ok) {
        return NextResponse.json(
          { error: false, message: 'Signin Failed' },
          { status: response.status }
        );
      }

      const data = await response.json();
      const token = data.accessToken;

     
      const userData = {
        accessToken: token,
        email: email,
        id: data.id,
        role_id: data.role_id,
      };
      
      

      // Encrypt the entire object
      const encryptedUserData = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        '!Tend@#$90'
      ).toString();

      const isProduction = process.env.NODE_ENV === 'production';
      const nextResponse = NextResponse.json({ success: true, data: data });

     
      nextResponse.cookies.set('userData', encryptedUserData, {
        httpOnly: true, // Always HTTP-only for security
        secure: isProduction, // Secure only in production
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return nextResponse;
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'An error occurred. Please try again.' },
        { status: 500 },
        console.error(e),
      )
    }
  } else if (action === 'logout') {
    // Clear the auth cookie
    const nextResponse = NextResponse.json({ success: true })
    nextResponse.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
    })
    return nextResponse
  
  }  else if (action === 'signup') {
    const { username, email, password, package_id, userType } = await req.json()

    // Send signup data to the backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      },
    )
    const data = await response.json()
    return NextResponse.json(data)
  } 
}
