declare module 'intuit-oauth' {
    import { AxiosInstance } from 'axios';
  
    interface TokenResponse {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      x_refresh_token_expires_in: number;
    }
  
    class IntuitOAuth {
      constructor(options: {
        clientId: string;
        clientSecret: string;
        environment: 'sandbox' | 'production';
        redirectUri: string;
      });
  
      authorizeUri(params: { scope: string[]; state?: string }): string;
      createToken(authCodeOrUrl: string): Promise<{ getJson: () => TokenResponse }>;
      refreshUsingToken(refreshToken: string): Promise<{ getJson: () => TokenResponse }>;
  
      readonly axios: AxiosInstance;
    }
  
    export default IntuitOAuth;
  }
  