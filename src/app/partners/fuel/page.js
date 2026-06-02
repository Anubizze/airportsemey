'use client';

import PartnerContentPage from '@/components/partners/PartnerContentPage';
import { useLanguage } from '@/context/LanguageContext';

export default function FuelPage() {
  const { t } = useLanguage();
  return <PartnerContentPage pageKey="fuel" parentCrumb={t.nav.fuel} />;
}
