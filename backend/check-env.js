console.log('🔍 Checking Environment Variables...\n');

console.log('DATABASE_URL:', process.env.DATABASE_URL || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set');

console.log('\n📁 Current working directory:', process.cwd());
console.log('📄 .env file exists:', require('fs').existsSync('.env') ? 'Yes' : 'No');
