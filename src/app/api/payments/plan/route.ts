import { json } from '@/lib/api-helpers';
import { planInfo } from '@/lib/payments/config';

// GET /api/payments/plan → is Premium on sale, and for how much (for the upgrade box)
export async function GET() {
  return json(planInfo(), { headers: { 'Cache-Control': 'no-store' } });
}
