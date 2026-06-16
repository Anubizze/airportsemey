'use client';

import PartnerContentPage from '@/components/partners/PartnerContentPage';
import { useLanguage } from '@/context/LanguageContext';

export default function TariffsPage() {
  const { t } = useLanguage();
  return <PartnerContentPage pageKey="tariffs" parentCrumb={t.nav.tariffs} />;
}
