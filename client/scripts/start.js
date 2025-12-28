const { spawn } = require('child_process');
const isWindows = process.platform === 'win32';

// Get port from environment variable or default to 3001
const port = process.env.PORT || 3001;

console.log('');
console.log('═══════════════════════════════════════════');
console.log('   🎨 Good Moments - Frontend');
console.log('');
console.log(`   🚀 App running on port: ${port}`);
console.log(`   🌐 Local: http://localhost:${port}`);
console.log('═══════════════════════════════════════════');
console.log('');
console.log('⏳ Starting the development server...\n');

// Prepare environment variables
const env = { ...process.env };
env.PORT = port;
env.NODE_OPTIONS = '--openssl-legacy-provider';

// Use npx to find react-scripts from node_modules
const command = isWindows ? 'npx.cmd' : 'npx';
const args = ['react-scripts', 'start'];

// Start react-scripts
const child = spawn(command, args, {
  stdio: 'inherit',
  shell: true,
  env: env
});

child.on('error', (error) => {
  console.error('❌ Error starting the app:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});
