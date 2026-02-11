import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const categories = [
  'AI Tools',
  'Productivity',
  'Tutorial',
  'Product Review',
  'News',
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              AI Productivity Hub
            </h3>
            <p className="text-sm leading-relaxed">
              Tutorials, reviews and guides for AI tools, productivity apps and
              more. Master AI tools and boost your productivity.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((name) => (
                <li key={name}>
                  <Link
                    href={`/blog?category=${encodeURIComponent(name)}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI Productivity Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
