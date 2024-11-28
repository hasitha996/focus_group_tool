import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';   
import { NextResponse } from 'next/server';

export const googleAuth = async (code) => {
    try {
 
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signin?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: true, message: 'Signin Failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const token = data.accessToken;

        const userData = {
            accessToken: token,
            email: data.user.email,
            id: data.user.id,
            name: data.user.name,
            role_id: data.user.role_id,
        };

        console.log(data); 


        const encryptedUserData = CryptoJS.AES.encrypt(
            JSON.stringify(userData),
            process.env.ENCRYPTION_KEY || 'default_key'
        ).toString();

   
        const isProduction = process.env.NODE_ENV === 'production';

        Cookies.set('userData', encryptedUserData, {
            expires: 7,  
            secure: isProduction, 
            path: '/',  
            sameSite: 'Strict', 
            httpOnly: false,  
        });

   
        return NextResponse.json({ success: true, data: data });

    } catch (error) {
        throw new Error('Google authentication failed: ' + error.message);
    }
};
