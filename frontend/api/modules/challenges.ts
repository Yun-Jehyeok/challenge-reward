import client from '../client';

export interface ChallengeSummary {
  id: string;
  title: string;
  description: string;
  participantCount: number;
  startDate: string;
  endDate: string;
  isEnded: boolean;
  isJoined: boolean;
}

export interface MyChallengeItem {
  id: string;
  title: string;
  endDate: string;
  currentStreak: number;
  isTodayProofDone: boolean;
  daysUntilEnd: number;
  isEnded: boolean;
}

export interface ChallengeDetail extends ChallengeSummary {
  createdAt: string;
  maxParticipants: number | null;
  isTodayProofDone: boolean;
}

export interface CreateChallengeDto {
  title: string;
  description: string;
  maxParticipants?: number | null;
  startDate: string;
  endDate: string;
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const challengesApi = {
  getList: (params?: { cursor?: string; limit?: number; keyword?: string }) =>
    client.get<CursorResponse<ChallengeSummary>>('/challenges', { params }),

  create: (data: CreateChallengeDto) =>
    client.post<{ challenge: ChallengeDetail }>('/challenges', data),

  getMy: () =>
    client.get<{ data: MyChallengeItem[] }>('/challenges/my'),

  getById: (id: string) =>
    client.get<ChallengeDetail>(`/challenges/${id}`),

  join: (id: string) =>
    client.post(`/challenges/${id}/join`),
};
