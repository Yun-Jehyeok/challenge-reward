import client from '../client';

export interface User {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  ticketCount: number;
  totalEarned: number;
  createdAt: string;
}

export interface UpdateProfileDto {
  nickname?: string;
  profileImageKey?: string;
}

export const usersApi = {
  getMe: () =>
    client.get<User>('/users/me'),

  updateMe: (data: UpdateProfileDto) =>
    client.patch<User>('/users/me', data),

  updateFcmToken: (fcmToken: string) =>
    client.patch('/users/me/fcm-token', { fcmToken }),

  deleteMe: () =>
    client.delete('/users/me'),
};
