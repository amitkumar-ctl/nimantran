import { Suspense } from 'react';
import { InviteEditor } from './InviteEditor';

export default function EditInvitePage({ params }: PageProps<'/dashboard/invites/[id]'>) {
  return (
    <Suspense fallback={<div className="container-page py-10"><div className="card h-96 animate-pulse" /></div>}>
      {params.then(({ id }) => <InviteEditor id={id} />)}
    </Suspense>
  );
}
