const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const OPENAPI_SPEC = path.resolve(__dirname, '../openapi/opal-merged.yaml');
const OUTPUT_DIR = path.resolve(__dirname, '../src/app/generated/api-client');
const GENERATOR_CLI = 'npx';

// Clean the output directory
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}

console.log(`🔧 Generating client from: ${OPENAPI_SPEC}`);

const result = spawnSync(
  GENERATOR_CLI,
  [
    'openapi-generator-cli',
    'generate',
    '-i', OPENAPI_SPEC,
    '-g', 'typescript-fetch',
    '-o', OUTPUT_DIR,
    '--skip-validate-spec',
    '--additional-properties=supportsES6=true,modelPropertyNaming=original'
  ],
  {
    stdio: 'inherit'
  }
);

if (result.status !== 0) {
  console.error(`❌ Failed to generate client from merged spec`);
  process.exit(result.status || 1);
}

// --- Post-process helpers ---
function fixNullAndImports(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Fix Null → null
  code = code.replace(/\bNull\b/g, 'null');

  // 2. Ensure imports for alias refs
  // Matches: export type Foo = Bar | null;
  const aliasRegex = /export type (\w+) = (\w+) \| null;/g;
  let match;
  while ((match = aliasRegex.exec(code)) !== null) {
    const refType = match[2];
    // If file does not already import refType, add it
    if (!code.includes(`import { ${refType} }`)) {
      code = `import { ${refType} } from './${refType}';\n` + code;
      console.log(`➕ Added import for ${refType} in ${path.basename(filePath)}`);
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

function processDir(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      fixNullAndImports(path.join(dir, file));
    }
  }
}

// --- Run post-processing ---
processDir(path.join(OUTPUT_DIR, 'models'));
processDir(path.join(OUTPUT_DIR, 'apis'));

// Create index.ts exports
const modelsDir = path.join(OUTPUT_DIR, 'models');
const apisDir = path.join(OUTPUT_DIR, 'apis');
const indexPath = path.join(OUTPUT_DIR, 'index.ts');

const modelExports = fs.existsSync(modelsDir)
  ? fs.readdirSync(modelsDir)
    .filter(f => f.endsWith('.ts'))
    .map(f => `export * from './models/${f.replace('.ts', '')}';`)
  : [];

const apiExports = fs.existsSync(apisDir)
  ? fs.readdirSync(apisDir)
    .filter(f => f.endsWith('.ts'))
    .map(f => `export * from './apis/${f.replace('.ts', '')}';`)
  : [];

fs.writeFileSync(indexPath, [...modelExports, ...apiExports].join('\n'));

console.log(`✅ OpenAPI client generated at: ${OUTPUT_DIR}`);
