const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Config paths
const CONFIG_PATH = path.resolve(__dirname, '../openapi/openapi-merge-config.json');
const MERGED_FILE = path.resolve(__dirname, '../openapi/opal-merged.yaml');

// --- Step 1: Parse merge config to get FILE_SUFFIX_MAP ---
const mergeConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Build a map: { 'filename.yaml': 'suffix' }
const FILE_SUFFIX_MAP = {};
for (const input of mergeConfig.inputs) {
  const inputURL = path.basename(input.inputURL);
  FILE_SUFFIX_MAP[inputURL] = input.dispute.suffix || '';
}

// --- Step 2: Parse merged YAML and rewrite $refs ---
const yamlContent = fs.readFileSync(MERGED_FILE, 'utf8');
const parsed = yaml.load(yamlContent);
parsed.openapi = '3.1.0';

// Recursively walk the object to rewrite $refs
function rewriteRefs(obj) {
  if (typeof obj !== 'object' || obj === null) return;

  for (const key in obj) {
    const val = obj[key];

    if (key === '$ref' && typeof val === 'string') {
      const match = val.match(/^\.\/([^/]+)#\/components\/(\w+)\/(.+)$/);
      if (match) {
        const [ , fileName, componentType, originalName ] = match;
        const suffix = FILE_SUFFIX_MAP[fileName];

        if (!suffix) {
          console.warn(`⚠️  No suffix found for file: ${fileName}`);
          continue;
        }

        const capitalizedSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
        const newName = `${originalName}${capitalizedSuffix}`;
        obj[key] = `#/components/${componentType}/${newName}`;
        console.log(`🔁 Rewrote $ref: ${val} → ${obj[key]}`);
      }
    } else if (typeof val === 'object') {
      rewriteRefs(val);
    }
  }
}

rewriteRefs(parsed);

// Dump back to YAML
const updatedYaml = yaml.dump(parsed, { noRefs: true });
fs.writeFileSync(MERGED_FILE, updatedYaml, 'utf8');

console.log(`✅ Updated $ref paths in: ${MERGED_FILE}`);
