import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkerRegistrationForm } from '@/components/WorkerRegistrationForm';

export default function WorkerRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <WorkerRegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
