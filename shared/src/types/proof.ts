export type ProofStatus = 'pending' | 'approved' | 'rejected';
export type VoteType = 'approve' | 'reject';

export interface ProofItem {
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

export interface CreateProofDto {
  imageKey: string;
  comment?: string;
}
