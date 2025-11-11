import Navbar from '@/components/navbar';
import Certifications from '@/components/certifications';
import Footer from '@/components/footer';
import { useSectionReveal } from '@/hooks/useSectionReveal';

export default function CertificationsPage() {
  useSectionReveal();

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold">Certifications</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </section>
        <Certifications />
      </main>
      <Footer />
    </div>
  );
}