export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface KakaoLoginResponse extends AuthTokens {
  isNewUser: boolean;
}
