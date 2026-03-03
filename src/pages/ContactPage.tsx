import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MapPin, Mail, Clock, Send, Loader2 } from 'lucide-react';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

/* ── Form schema ──────────────────────────────────────────── */
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const WEB3FORMS_ACCESS_KEY = 'c67f21e2-a4d4-48fe-9375-72a7b1218d74';

const openingHours = [
  { day: 'Monday – Friday', hours: '7:00 – 18:00' },
  { day: 'Saturday', hours: '7:30 – 18:00' },
  { day: 'Sunday', hours: '8:00 – 18:00' },
];

/* ── Contact Page ─────────────────────────────────────────── */
export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: '' },
  });

  /* ── GSAP animations ──────────────────────────────────── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Page fade-in
      if (pageRef.current) {
        gsap.fromTo(pageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        );
      }

      // Hero title & subtitle
      if (heroRef.current) {
        const els = heroRef.current.querySelectorAll('.hero-anim');
        gsap.fromTo(els,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'expo.out', delay: 0.2 },
        );
      }

      // Info cards stagger
      if (infoRef.current) {
        const cards = infoRef.current.querySelectorAll('.info-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'expo.out',
            scrollTrigger: { trigger: infoRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        );
      }

      // Form slide in
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.7, ease: 'expo.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ── Form submission ──────────────────────────────────── */
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Message sent! We\'ll get back to you soon.');
        reset();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Shared input classes ─────────────────────────────── */
  const inputBase =
    'w-full bg-white/60 backdrop-blur-sm border border-[var(--sandstone)] rounded-lg px-4 py-3 text-sm font-body text-[var(--text-primary)] placeholder:text-[var(--soft-clay)] outline-none transition-all duration-300 focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20';

  return (
    <div ref={pageRef} className="pt-20">
      {/* ── Hero section ──────────────────────────────────── */}
      <section ref={heroRef} className="section-padding py-16 md:py-24 text-center max-w-4xl mx-auto">
        <p className="hero-anim font-body text-sm tracking-[0.3em] uppercase text-coral mb-4">
          Get in Touch
        </p>
        <h1 className="hero-anim font-display text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6">
          We'd Love to{' '}
          <span
            className="text-coral"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Hear From You
          </span>
        </h1>
        <p className="hero-anim font-body text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you have a question, want to book an event, or simply want to say hello — drop us a message and we'll get back to you as soon as we can.
        </p>
      </section>

      {/* ── Main content: info + form ─────────────────────── */}
      <section className="section-padding pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* ── Left: Contact info ──────────────────────── */}
          <div ref={infoRef} className="lg:col-span-2 space-y-6">

            {/* Address */}
            <div className="info-card bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[var(--sandstone)]/40">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                  <MapPin size={20} className="text-coral" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-[var(--text-primary)] mb-1">Visit Us</h3>
                  <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                    157 Bethnal Green Rd,<br />
                    London E2 7DG
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="info-card bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[var(--sandstone)]/40">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                  <Mail size={20} className="text-coral" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-[var(--text-primary)] mb-1">Email Us</h3>
                  <a
                    href="mailto:info@coffeematterslondon.com"
                    className="font-body text-sm text-coral hover:underline transition-colors duration-300"
                  >
                    info@coffeematterslondon.com
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="info-card bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[var(--sandstone)]/40">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                  <Clock size={20} className="text-coral" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-[var(--text-primary)] mb-3">Opening Hours</h3>
                  <ul className="space-y-2">
                    {openingHours.map((item) => (
                      <li key={item.day} className="flex justify-between gap-4 font-body text-sm">
                        <span className="text-[var(--text-primary)]">{item.day}</span>
                        <span className="text-[var(--text-secondary)]">{item.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="info-card overflow-hidden rounded-2xl border border-[var(--sandstone)]/40 h-52 lg:h-64">
              <iframe
                title="Coffee Matters location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.0!2d-0.0754082!3d51.5255596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d72a577c8a1%3A0x94b1e30154f9ca7e!2sCoffee%20Matters!5e0!3m2!1sen!2suk!4v1700000000000"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── Right: Contact form ─────────────────────── */}
          <div ref={formRef} className="lg:col-span-3">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-[var(--sandstone)]/40">
              <h2 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] mb-2">
                Send a Message
              </h2>
              <p className="font-body text-sm text-[var(--text-secondary)] mb-8">
                Fill in the form below and we'll respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className={`${inputBase} ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-body">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`${inputBase} ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-body">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block font-body text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className={`${inputBase} ${errors.subject ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''} ${!errors.subject ? 'text-[var(--text-primary)]' : ''}`}
                    {...register('subject')}
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Event Booking">Event Booking</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500 font-body">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className={`${inputBase} resize-none ${errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-body">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-coral text-white font-body text-sm font-medium tracking-wider uppercase px-8 py-3.5 rounded-lg transition-all duration-300 hover:bg-[#a34b30] hover:shadow-lg hover:shadow-coral/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
