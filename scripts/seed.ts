/* Load .env.local before any other imports that use process.env */
require('./load-env');

import connectDB from '../lib/db';
import User from '../models/User';

async function seed() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      'Missing ADMIN_EMAIL or ADMIN_PASSWORD. Set them in .env.local'
    );
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({
    email: ADMIN_EMAIL.trim().toLowerCase(),
  });

  if (existing) {
    console.log('Admin user already exists for:', ADMIN_EMAIL);
    process.exit(0);
  }

  await User.create({
    email: ADMIN_EMAIL.trim().toLowerCase(),
    password: ADMIN_PASSWORD,
  });

  console.log('Admin user created for:', ADMIN_EMAIL);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
