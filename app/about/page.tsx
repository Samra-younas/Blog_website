import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about AI Productivity Hub — tutorials, reviews and guides for AI tools and productivity.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About</h1>
      <div className="max-w-none text-slate-700 space-y-6">
        <p className="text-lg leading-relaxed">
          AI Productivity Hub is a blog dedicated to helping you get more done
          with AI tools and productivity apps. We publish tutorials, how-to
          guides, and honest reviews so you can choose the right tools and use
          them effectively.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">
            Our mission
          </h2>
          <p className="leading-relaxed">
            We believe that the right AI and productivity tools can save you
            time, reduce friction, and help you focus on what matters. Our
            mission is to cut through the noise and give you clear, practical
            guidance — whether you’re comparing apps, learning a new workflow, or
            staying up to date with what’s new in AI and productivity.
          </p>
        </section>
        <p className="leading-relaxed">
          Thank you for reading. If you have ideas or questions, get in touch
          via our contact page.
        </p>
      </div>
    </div>
  );
}
