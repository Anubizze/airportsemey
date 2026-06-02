'use client';

import PartnerContentPage from '@/components/partners/PartnerContentPage';
import { useLanguage } from '@/context/LanguageContext';

export default function TenantsPage() {
  const { t } = useLanguage();
  return <PartnerContentPage pageKey="tenants" parentCrumb={t.nav.tenants} />;
}
