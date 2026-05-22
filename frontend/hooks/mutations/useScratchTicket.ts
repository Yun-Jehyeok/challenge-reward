import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../../api/modules/tickets';
import { queryKeys } from '../../constants/queryKeys';

export function useScratchTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ticketsApi.scratch(ticketId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
    },
  });
}
