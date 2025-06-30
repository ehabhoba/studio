import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RequestTracker } from '@/components/RequestTracker';

export default function TrackRequestsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <RequestTracker />
      </main>
      <Footer />
    </div>
  );
}
