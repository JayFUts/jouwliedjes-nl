// This script handles Prisma generation during build time
const { execSync } = require('child_process');

console.log('Running Prisma generate...');

// Set a dummy DATABASE_URL if not present during build
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db?schema=public';
  console.log('Using dummy DATABASE_URL for build');
}

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generate completed successfully');
} catch (error) {
  console.error('Prisma generate failed:', error);
  process.exit(1);
}