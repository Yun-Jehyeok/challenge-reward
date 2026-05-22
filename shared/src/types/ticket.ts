export type TicketStatus = 'pending' | 'ad_completed' | 'scratched';

export interface TicketItem {
  id: string;
  status: TicketStatus;
  challengeTitle: string;
  rewardAmount: number | null;
  createdAt: string;
}
