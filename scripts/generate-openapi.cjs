const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const OPENAPI_SPEC = path.resolve(__dirname, '../openapi/opal-merged.yaml');
const OPENAPI_TEMPLATES = path.resolve(__dirname, '../openapi/templates');
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
    '-t', OPENAPI_TEMPLATES,
    '--skip-validate-spec',
    '--additional-properties=supportsES6=true,modelPropertyNaming=original',
    '--global-property debugModels=true'
  ],
  {
    stdio: 'inherit'
  }
);

if (result.status !== 0) {
  console.error(`❌ Failed to generate client from merged spec`);
  process.exit(result.status || 1);
}

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
