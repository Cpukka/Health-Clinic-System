// scripts/vercel-migrate.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    // Run migrations
    console.log('🔄 Running migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();