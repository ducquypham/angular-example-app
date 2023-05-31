export interface RefreshTokenResponse {
  errors?: unknown;
  data?: {
    refreshToken: {
      token: string;
    };
  };
}
