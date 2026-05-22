import client from '../client';
import { CursorResponse } from './challenges';

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

export const walletApi = {
  getWallet: () =>
    client.get<Wallet>('/wallet'),

  getTransactions: (cursor?: string) =>
    client.get<CursorResponse<WalletTransaction>>('/wallet/transactions', { params: { cursor } }),
};
