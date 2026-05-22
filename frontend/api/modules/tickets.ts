import client from '../client';
import { CursorResponse } from './challenges';

export type TicketStatus = 'pending' | 'ad_completed' | 'scratched';

export interface TicketSummary {
  id: string;
  status: TicketStatus;
  challengeTitle: string;
  createdAt: string;
}

export interface TicketDetail {
  id: string;
  status: TicketStatus;
  rewardAmount: number | null;
}

export interface ScratchResult {
  rewardAmount: number;
  ticket: { id: string; status: 'scratched'; scratchedAt: string };
  wallet: { balance: number; totalEarned: number };
}

export const ticketsApi = {
  getList: (params?: { status?: TicketStatus; cursor?: string; limit?: number }) =>
    client.get<CursorResponse<TicketSummary>>('/tickets', { params }),

  getById: (id: string) =>
    client.get<TicketDetail>(`/tickets/${id}`),

  scratch: (id: string) =>
    client.post<ScratchResult>(`/tickets/${id}/scratch`),
};
