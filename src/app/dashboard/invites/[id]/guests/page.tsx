import { Suspense } from 'react';
import { GuestList } from './GuestList';

export default function GuestsPage({ params }: PageProps<'/dashboard/invites/[id]/guests'>) {
  return (
    <Suspense fallback={<div className="container-page py-10"><div className="card h-96 animate-pulse" /></div>}>
      {params.then(({ id }) => <GuestList id={id} />)}
    </Suspense>
  );
}