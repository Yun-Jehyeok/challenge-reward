import client from '../client';

export const authApi = {
  kakaoLogin: (code: string) =>
    client.post<{ accessToken: string; refreshToken: string; isNewUser: boolean }>('/auth/kakao', { code }),

  refresh: (refreshToken: string) =>
    client.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  logout: () =>
    client.delete('/auth/logout'),
};
