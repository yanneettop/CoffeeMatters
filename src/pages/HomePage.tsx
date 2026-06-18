import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/Hero';
import SignatureSection from '../sections/SignatureSection';
import OurCoffee from '../sections/OurCoffee';
import SweetsBrunch from '../sections/SweetsBrunch';
import HostEvents from '../sections/HostEvents';
import AboutUs from '../sections/AboutUs';
import NewsletterCTA from '../sections/NewsletterCTA';
import GoogleReviews from '../sections/GoogleReviews';
import Footer from '../sections/Footer';
import ScrollMarquee from '../components/ScrollMarquee';
import Seo from '../components/Seo';

export default function HomePage() {
  /* Global subtle parallax drift on all sections */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1280) return; // Keep tablet and small laptop proportions steady.

    let ctx: gsap.Context | null = null;

    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        const sections = document.querySelectorAll('main section');

        sections.forEach((section) => {
          // Skip hero because it has its own parallax.
          if (section.id === 'home') return;

          gsap.fromTo(section,
            { y: 36 },
            {
              y: -24,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        });
      });
    }, 600);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, []);

  /* Refresh ScrollTrigger after the home sections mount */
  useEffect(() => {
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Seo path="/" />
      <Hero />
      <SignatureSection />
      <div className="block"><ScrollMarquee direction={-1} /></div>
      <OurCoffee />
      <SweetsBrunch />
      <div className="block"><ScrollMarquee direction={1} /></div>
      <HostEvents />
      <AboutUs />
      <GoogleReviews />
      <NewsletterCTA />
      <Footer />
    </>
  );
}
