export interface ChallengeSummary {
  id: string;
  title: string;
  description: string | null;
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
  isEnded: boolean;
  currentStreak: number;
  isTodayProofDone: boolean;
  daysUntilEnd: number;
}

export interface CreateChallengeDto {
  title: string;
  description?: string;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
}
