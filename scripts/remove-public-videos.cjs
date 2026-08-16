/**
 * Deletes the entire public/videos folder (unused; app uses S3).
 * Run: npm run clean:public-videos
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'videos');

function rmrf(d) {
  if (!fs.existsSync(d)) return 0;
  let count = 0;
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, ent.name);
    if (ent.isDirectory()) count += rmrf(full);
    else {
      fs.unlinkSync(full);
      count++;
    }
  }
  fs.rmdirSync(d);
  return count;
}

try {
  const existed = fs.existsSync(dir);
  const n = rmrf(dir);
  if (!existed) {
    console.log('public/videos did not exist; nothing to do.');
  } else {
    console.log(`Removed public/videos (${n} file(s)).`);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
