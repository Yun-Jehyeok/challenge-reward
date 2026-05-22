export const queryKeys = {
  challenges: {
    all: ['challenges'] as const,
    my: ['challenges', 'my'] as const,
    detail: (id: string) => ['challenges', id] as const,
  },
  proofs: {
    reviewQueue: ['proofs', 'review-queue'] as const,
    reviewQueueCount: ['proofs', 'review-queue', 'count'] as const,
    detail: (id: string) => ['proofs', id] as const,
  },
  tickets: {
    all: ['tickets'] as const,
    detail: (id: string) => ['tickets', id] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    transactions: ['wallet', 'transactions'] as const,
  },
} as const;
