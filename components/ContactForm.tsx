'use client';

export default function ContactForm() {
  return (
    <form
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          placeholder="Your name"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none"
          placeholder="Your message…"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 text-white py-3 font-medium hover:bg-slate-800 transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
