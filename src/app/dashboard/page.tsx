import { Suspense } from 'react';
import { DashboardHome } from './DashboardHome';

function DashboardSkeleton() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mb-8 h-14 w-64 animate-pulse rounded-xl bg-cream-2" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="card h-44 animate-pulse" />)}</div>
    </div>
  );
}

// DashboardHome reads ?template= (from "Use this design"), so it sits inside <Suspense>.
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardHome />
    </Suspense>
  );
}
