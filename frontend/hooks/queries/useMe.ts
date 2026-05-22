import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../api/modules/users';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMe().then((res) => res.data),
  });
}
