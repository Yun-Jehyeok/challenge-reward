import client from '../client';
import { CursorResponse } from './challenges';

export type ProofStatus = 'pending' | 'approved' | 'rejected';
export type VoteType = 'approve' | 'reject';
export type ReportReason = 'irrelevant_photo' | 'spam' | 'stolen_photo' | 'hate_speech';

export interface ReviewQueueItem {
  id: string;
  challengeTitle: string;
  imageUrl: string;
  comment: string | null;
  uploaderNickname: string;
  uploaderProfileImageUrl: string | null;
  approveCount: number;
  rejectCount: number;
  createdAt: string;
}

export interface ProofDetail {
  id: string;
  status: ProofStatus;
  proofDate: string;
  imageUrl: string;
  comment: string | null;
  approveCount: number;
  rejectCount: number;
  createdAt: string;
}

export interface CreateProofDto {
  imageKey: string;
  comment?: string;
}

export const proofsApi = {
  create: (challengeId: string, data: CreateProofDto) =>
    client.post<{ proof: ProofDetail }>(`/challenges/${challengeId}/proofs`, data),

  getReviewQueue: (cursor?: string) =>
    client.get<CursorResponse<ReviewQueueItem>>('/proofs/review-queue', { params: { cursor } }),

  getReviewQueueCount: () =>
    client.get<{ count: number }>('/proofs/review-queue/count'),

  getById: (id: string) =>
    client.get<ProofDetail>(`/proofs/${id}`),

  vote: (id: string, vote: VoteType) =>
    client.post(`/proofs/${id}/votes`, { vote }),

  report: (id: string, reason: ReportReason) =>
    client.post<{ reportId: string }>(`/proofs/${id}/reports`, { reason }),
};
