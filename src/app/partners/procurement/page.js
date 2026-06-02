'use client';

import PartnerContentPage from '@/components/partners/PartnerContentPage';
import { useLanguage } from '@/context/LanguageContext';

export default function ProcurementPage() {
  const { t } = useLanguage();
  return <PartnerContentPage pageKey="procurement" parentCrumb={t.nav.procurement} />;
}
