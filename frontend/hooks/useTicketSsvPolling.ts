import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/modules/tickets';
import { queryKeys } from '../constants/queryKeys';

export function useTicketSsvPolling(ticketId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(ticketId),
    queryFn: () => ticketsApi.getById(ticketId).then((res) => res.data),
    enabled,
    refetchInterval: (query) => {
      if (query.state.data?.status === 'ad_completed') return false;
      return 1000;
    },
    retry: 10,
  });
}
