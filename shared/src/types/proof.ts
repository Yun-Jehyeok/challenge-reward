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
