import client from '../client';

export const authApi = {
  kakaoLogin: (accessToken: string) =>
    client.post<{ accessToken: string; refreshToken: string; isNewUser: boolean; user: { id: string; nickname: string | null; profileImageUrl: string | null; role: string; createdAt: string } }>('/auth/kakao', { accessToken }),

  refresh: (refreshToken: string) =>
    client.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  logout: () =>
    client.delete('/auth/logout'),
};
