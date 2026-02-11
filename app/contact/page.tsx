import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with AI Productivity Hub.',
};

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact</h1>
      <p className="text-slate-600 mb-8">
        Send us a message and we’ll get back to you as soon as we can.
      </p>
      <ContactForm />
    </div>
  );
}
