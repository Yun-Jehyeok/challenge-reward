export interface Wallet {
  balance: number;
  totalEarned: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'earn';
  challengeTitle: string;
  createdAt: string;
}
