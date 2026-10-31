import { Suspense } from 'react';
import { FamilyCards } from './FamilyCards';

export default function FamilyCardsPage({ params }: PageProps<'/dashboard/invites/[id]/cards'>) {
  return (
    <Suspense fallback={<div className="container-page py-10"><div className="card h-96 animate-pulse" /></div>}>
      {params.then(({ id }) => <FamilyCards id={id} />)}
    </Suspense>
  );
}
