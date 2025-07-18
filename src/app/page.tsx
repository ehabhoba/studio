import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MaintenanceRequestForm } from '@/components/MaintenanceRequestForm';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MaintenanceRequestForm />
      </main>
      <Footer />
    </div>
  );
}
