import Hero from '@/components/home/Hero';
import FlightTable from '@/components/home/FlightTable';
import QuickServices from '@/components/home/QuickServices';
import CheckinSection from '@/components/home/CheckinSection';
import NewsSection from '@/components/home/NewsSection';
import Partners from '@/components/home/Partners';

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickServices />
      <FlightTable />
      <CheckinSection />
      <NewsSection />
      <Partners />
    </>
  );
}
