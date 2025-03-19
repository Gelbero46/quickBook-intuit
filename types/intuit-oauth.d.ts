declare module 'intuit-oauth' {
  import { AxiosInstance } from 'axios';

  interface TokenResponse {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      x_refresh_token_expires_in: number;
  }

  class IntuitOAuth {
      static scopes: any;
      constructor(options: {
          clientId: string;
          clientSecret: string;
          environment: 'sandbox' | 'production';
          redirectUri: string;
          scopes?: string[]; // Added scope property
      });

      authorizeUri(params: { scope: string[]; state?: string }): string;
      createToken(authCodeOrUrl: string): Promise<{ getJson: () => TokenResponse }>;
      refreshUsingToken(refreshToken: string): Promise<{ getJson: () => TokenResponse }>;
      refresh(): Promise<{ getJson: () => TokenResponse }>; // Added refresh() method

      readonly axios: AxiosInstance;
  }

  export default IntuitOAuth;
}

export interface TokenType {
  token_type: string
  access_token: string
  expires_in: number
  refresh_token: string
  x_refresh_token_expires_in: number
  realmId: string,
  id_token: string,
  createdAt: number
}