import { useEffect } from 'react';

export function useSectionReveal() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    } as const;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const sections = Array.from(document.querySelectorAll('.section-reveal'));
    sections.forEach((section) => observer.observe(section));

    // Initial reveal for elements already in view
    const initialReveal = () => {
      sections.forEach((section, index) => {
        setTimeout(() => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            section.classList.add('revealed');
          }
        }, index * 200);
      });
    };

    const timeoutId = window.setTimeout(initialReveal, 100);

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
}