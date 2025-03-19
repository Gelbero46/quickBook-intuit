import Redis from "ioredis";
import { TokenType } from "@/types/intuit-oauth";
const redis = new Redis(process.env.REDIS_URL!);

export async function saveSession(userId: string, tokenData: TokenType) {
    const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;
    const refreshExpiresAt = Math.floor(Date.now() / 1000) + tokenData.x_refresh_token_expires_in - tokenData.expires_in;
    console.log("expiresAt", expiresAt)
    console.log("refreshExpiresAt", refreshExpiresAt)
  
    const session = {
    ...tokenData,
    expires_at: expiresAt,
    refresh_expires_at: refreshExpiresAt,
  };
  console.log("session", session)

  await redis.set(`quickbooks:${userId}`, JSON.stringify(session), "EX", tokenData.x_refresh_token_expires_in);
}

export async function getSession(userId: string) {
  const session = await redis.get(`quickbooks:${userId}`);
  return session ? JSON.parse(session) : null;
}
