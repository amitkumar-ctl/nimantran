import { InviteView } from '@/components/invite/InviteView';
import { sampleInvite } from '@/lib/sample';
import type { Theme } from '@/lib/validation';

/** Decorative, non-interactive phone mock-up showing a sample invite. */
export function PhonePreview({ theme = 'royal', className = '' }: { theme?: Theme; className?: string }) {
  return (
    <div className={`mx-auto w-[300px] overflow-hidden rounded-[2.4rem] border-[10px] border-ink bg-ink shadow-2xl sm:w-[330px] ${className}`} aria-hidden="true" inert>
      <div className="h-[600px] overflow-hidden rounded-[1.8rem] bg-white sm:h-[640px]">
        <InviteView framed invite={sampleInvite(theme)} />
      </div>
    </div>
  );
}
