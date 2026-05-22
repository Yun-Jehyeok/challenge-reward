import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketsApi, TicketStatus } from '../../api/modules/tickets';
import { queryKeys } from '../../constants/queryKeys';

export function useTickets(status?: TicketStatus) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.tickets.all, { status }],
    queryFn: ({ pageParam }) =>
      ticketsApi.getList({ status, cursor: pageParam as string | undefined }).then((res) => res.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
