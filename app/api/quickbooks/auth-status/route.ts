import { NextResponse } from "next/server";
// import IntuitOAuth from "intuit-oauth";
import oauthClient from '@/lib/intuitOAuth';
import { saveSession, getSession } from "@/lib/redis";

// const oauthClient = new IntuitOAuth({
//   clientId: process.env.QUICKBOOKS_CLIENT_ID!,
//   clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
//   environment: (process.env.QUICKBOOKS_ENVIRONMENT as "sandbox" | "production") || "sandbox",
//   redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
// });

async function checkAuthStatus() {
  // try {
  //   // Check if the current token is still valid
  //   let authToken = oauthClient.token.getToken();
  //   console.log("authToken", authToken)
  //   const isvalid: boolean = oauthClient.isAccessTokenValid()
  //   console.log("isvalid", isvalid)
  //   if (isvalid) {
  //     return { authorized: true };
  //   }
  //   return { authorized: false };
  // } catch (error) {
  //   console.error("Error checking auth status:", error);
  //   return { authorized: false };
  // }

  

}

export async function GET() {
  // const authStatus = await checkAuthStatus();
  // return NextResponse.json(authStatus);
  const userId = "user123"; // Replace with actual user ID

  // Retrieve session from Redis
  const sessionData = await getSession(userId);
  // console.log("sessionData", sessionData)

  if (!sessionData || !sessionData.access_token) {
    return NextResponse.json({ authorized: false });
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = sessionData.expires_at || 0;

  // If access token is expired, refresh it
  if (now >= expiresAt) {
    if (!sessionData.refresh_token) {
      return NextResponse.json({ authorized: false });
    }

    try {
      // Refresh the access token
      const authResponse = await oauthClient.refreshUsingToken(sessionData.refresh_token);
      const newTokenData = authResponse.getJson();
      console.log("newTokenData", newTokenData)
      // Save the new tokens in Redis
      await saveSession(userId, newTokenData);

      return NextResponse.json({ authorized: true });
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return NextResponse.json({ authorized: false });
    }
  }

  return NextResponse.json({ authorized: true });
}
