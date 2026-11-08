const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

async function testFile(filename) {
  const filePath = path.join(__dirname, '../docs/evidence/fixtures', filename);
  const buf = fs.readFileSync(filePath);
  const { data: { text, confidence } } = await Tesseract.recognize(buf, 'eng');
  console.log(`\n=================== FILE: ${filename} (Confidence: ${confidence}%) ===================`);
  console.log(text.trim());
}

async function main() {
  await testFile('daily-ads-1.png');
  await testFile('daily-ads-2.png');
  await testFile('daily-ads-1-renamed.png');
  await testFile('summary-ads.png');
  await testFile('blurry-ads.png');
}

main().catch(console.error);
