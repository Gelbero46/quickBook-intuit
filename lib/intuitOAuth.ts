import IntuitOAuth from "intuit-oauth";

const oauthClient = new IntuitOAuth({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: (process.env.QUICKBOOKS_ENVIRONMENT as "sandbox" | "production") || "sandbox",
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
});

export default oauthClient;
