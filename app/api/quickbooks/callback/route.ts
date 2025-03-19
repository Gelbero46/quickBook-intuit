import { NextResponse } from 'next/server';
// import IntuitOAuth from 'intuit-oauth';
import oauthClient from '@/lib/intuitOAuth';
import { saveSession } from "@/lib/redis";

// const oauthClient = new IntuitOAuth({
//   clientId: process.env.QUICKBOOKS_CLIENT_ID!,
//   clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
//   environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
//   redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
// });

const home: string = process.env.APP_URL || ""
console.log("home", home)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const authCode = url.searchParams.get('code');
  const realmId = url.searchParams.get('realmId'); 
  if (!authCode || !realmId) {
    return NextResponse.json({ error: 'Authorization failed' }, { status: 400 });
  }

  
  try {
    const authResponse = await oauthClient.createToken(req.url);
    const authToken = authResponse.getJson()
    // const accessToken = authResponse.getJson().access_token;
    // const refreshToken = authResponse.getJson().refresh_token;

    // Store tokens securely (e.g., database, encrypted storage)
    // console.log('Access Token:', accessToken);
    // console.log('Refresh Token:', refreshToken);
    // oauthClient.setToken(authToken);

    // let getToken = oauthClient.token.getToken();
    // console.log("getToken", getToken)


    // Save to Redis
    await saveSession("user123", authToken);

    // return NextResponse.redirect(home);
    return NextResponse.json({ message: 'Authorization successful' });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
