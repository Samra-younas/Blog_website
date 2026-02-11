'use client';

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 text-white px-6 py-3 font-medium hover:bg-slate-800 transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
