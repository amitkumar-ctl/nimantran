'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';

export function UserMenu() {
  const router = useRouter();
  const qc = useQueryClient();
  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      router.replace('/login');
      // Safe now: the "me" query below is disabled, so clearing the cache
      // doesn't trigger a refetch (which would 401, the cookie being gone).
      qc.clear();
    },
  });
  const { data: user } = useQuery({ queryKey: queryKeys.me, queryFn: api.me, enabled: logout.isIdle });

  return (
    <div className="flex items-center gap-2">
      {user && (
        <span className="hidden items-center gap-2 text-sm text-muted sm:flex">
          {user.avatarUrl ? (
            // Google profile photo; plain <img> avoids configuring remote image domains.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" width={32} height={32} referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cream-2 font-semibold text-maroon">{user.name.charAt(0).toUpperCase()}</span>
          )}
          {user.name}
        </span>
      )}
      <button type="button" onClick={() => logout.mutate()} className="btn btn-ghost btn-sm" disabled={logout.isPending}>
        <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
      </button>
    </div>
  );
}
