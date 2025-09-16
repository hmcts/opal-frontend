const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.resolve(__dirname, '../src/app/generated/api-client/models');

// Regex: match "<identifier>?: <type>;"
const pattern = /(\w+)\?: ([^;]+);/g;
const replacer = (_match, name, type) => `${name}: ${type} | null;`;

if (!fs.existsSync(MODELS_DIR)) {
  console.error(`Models directory not found: ${MODELS_DIR}`);
  process.exit(1);
}

for (const file of fs.readdirSync(MODELS_DIR)) {
  if (!file.endsWith('.ts')) continue;

  const filePath = path.join(MODELS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const updated = content.replace(pattern, replacer);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${file}`);
  }
}
