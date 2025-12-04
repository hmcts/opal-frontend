const fs = require('fs');
const path = require('path');

const STEP_DIR = path.resolve('cypress/support/step_definitions/newStyleSteps');
const FEATURE_DIR = path.resolve('cypress/e2e');
const EXCLUDE_PART = 'manualAccountCreation';
const STEP_GLOB_EXT = '.ts';
const FEATURE_EXT = '.feature';

function walk(dir, ext, skipExcludes = false) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (skipExcludes && p.includes(EXCLUDE_PART)) continue;
      out.push(...walk(p, ext, skipExcludes));
    } else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

function escapeForRegExp(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const stepFiles = walk(STEP_DIR, STEP_GLOB_EXT, true)
  .filter(f => !f.includes('manual-account-creation'));
const featureFiles = walk(FEATURE_DIR, FEATURE_EXT, true);

const featuresContent = featureFiles.map(f => ({ f, text: fs.readFileSync(f, 'utf8') }));

console.log('Scanning', stepFiles.length, 'newStyleSteps files and', featureFiles.length, 'feature files (excluded manualAccountCreation).\n');

let totalUnused = 0;

for (const sf of stepFiles) {
  const text = fs.readFileSync(sf, 'utf8');
  // Match steps with optional trailing colon (DataTable support)
  const stepRe = /\b(Given|When|Then)\(\s*'([^']+?)(:?)',\s*(?:\([^)]*\)|async\s*\(\s*\))\s*=>/g;
  let m;
  let fileUnused = [];

  while ((m = stepRe.exec(text)) !== null) {
    const stepText = m[2].trim();
    // Build regex: escape then replace Cucumber placeholders
    let rx = escapeForRegExp(stepText)
      .replace(/\\\{string\\\}/g, '("[^"]*"|\'[^\']*\'|[^\\s:]+)')
      .replace(/\\\{int\\\}/g, '\\d+')
      .replace(/\\\{float\\\}/g, '\\d+(?:\\.\\d+)?')
      .replace(/\\\{word\\\}/g, '\\w+');

    // Allow optional trailing colon and whitespace (for DataTable steps)
    const finalRe = new RegExp('^\\s*(Given|When|Then|And|But)\\s+' + rx + '\\s*:?\\s*$', 'm');

    const found = featuresContent.some(({ text }) => finalRe.test(text));

    if (!found) {
      fileUnused.push(stepText);
    }
  }

  if (fileUnused.length > 0) {
    console.log('===', path.relative(process.cwd(), sf), '===');
    fileUnused.forEach(step => {
      console.log('  ❌', step);
      totalUnused++;
    });
    console.log();
  }
}

console.log(`\nTotal unused steps in newStyleSteps: ${totalUnused}`);
