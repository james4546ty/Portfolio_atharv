import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import Projects from '@/components/projects';
import Certifications from '@/components/certifications';
import Hackathons from '@/components/hackathons';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import { useSectionReveal } from '@/hooks/useSectionReveal';

export default function Home() {
  useSectionReveal();

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Hackathons />
      <Contact />
      <Footer />
    </div>
  );
}
