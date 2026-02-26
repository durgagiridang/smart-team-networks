const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'src', 'app', 'admin');

// Remove गर्नुपर्ने folders
const foldersToRemove = [
  'history',
  'menu', 
  'api',
  'auth',
  'dashboard',
  'kitchen-monitor',
  'live-kitchen'
];

console.log('🧹 Cleaning admin folder...\n');

foldersToRemove.forEach(folder => {
  const folderPath = path.join(adminPath, folder);
  
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✅ Removed: admin/${folder}`);
  } else {
    console.log(`⚠️ Not found: admin/${folder}`);
  }
});

console.log('\n🎉 Cleanup complete!');
console.log('\n📁 Remaining folders in admin/:');
const remaining = fs.readdirSync(adminPath).filter(f => 
  fs.statSync(path.join(adminPath, f)).isDirectory()
);
remaining.forEach(f => console.log(`   ✅ ${f}`));