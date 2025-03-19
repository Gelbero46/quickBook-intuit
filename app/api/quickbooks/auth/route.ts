import { NextResponse } from 'next/server';
import IntuitOAuth from 'intuit-oauth';
import oauthClient from '@/lib/intuitOAuth';

// const oauthClient = new IntuitOAuth({
//   clientId: process.env.QUICKBOOKS_CLIENT_ID!,
//   clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
//   environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
//   redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
// });


export async function GET() {
  console.log("Authorizing ...")
  const authUri = oauthClient.authorizeUri({
    scope: [IntuitOAuth.scopes.Accounting], 
    state: 'random-state', 
  });

  console.log("authUri", authUri)

  return NextResponse.redirect(authUri);
  // return NextResponse.json({ authUrl: authUri });

}
