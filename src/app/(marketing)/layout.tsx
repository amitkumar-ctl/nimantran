import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
