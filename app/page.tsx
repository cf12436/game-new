import { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://game-hub.site',
  },
};

export default function Page() {
  return <HomePage />;
}
