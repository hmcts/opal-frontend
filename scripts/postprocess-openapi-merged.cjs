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
  const inputFile = path.basename(input.inputFile);
  FILE_SUFFIX_MAP[inputFile] = input.dispute.suffix || '';
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
      // Match $ref: ./types.yaml#/components/schemas/Foo
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

function hasNullUnion(s) {
  const u = s.oneOf || s.anyOf || [];
  return Array.isArray(u) && u.some(x => x && x.type === 'null');
}

function addNullToUnion(s) {
  if (s.oneOf) {
    if (!hasNullUnion(s)) s.oneOf.push({ type: 'null' });
  } else if (s.anyOf) {
    if (!hasNullUnion(s)) s.anyOf.push({ type: 'null' });
  } else {
    s.oneOf = [ { ...s }, { type: 'null' } ];
    // remove duplicated keywords from the wrapper arm
    for (const k of Object.keys(s.oneOf[0])) delete s[k];
  }
}

function makeOptionalRequiredAndNullable(schema) {
  if (!schema || typeof schema !== 'object') return;

  if (schema.type === 'object' && schema.properties) {
    schema.required = schema.required || [];
    const req = new Set(schema.required);

    for (const [prop, def] of Object.entries(schema.properties)) {
      if (!req.has(prop)) {
        // make required
        schema.required.push(prop);
        req.add(prop);

        // make nullable (3.1-valid)
        if (def.$ref) {
          const { $ref, ...rest } = def;
          // replace schema with oneOf [$ref, null] and keep metadata
          Object.assign(def, rest);
          delete def.$ref;
          delete def.type;
          def.oneOf = [ { $ref }, { type: 'null' } ];
        } else if (def.oneOf || def.anyOf) {
          addNullToUnion(def);
        } else if (def.type !== undefined) {
          if (Array.isArray(def.type)) {
            if (!def.type.includes('null')) def.type.push('null');
          } else {
            def.type = [def.type, 'null'];
          }
        } else {
          // no $ref, no type → wrap as union with null
          const copy = JSON.parse(JSON.stringify(def));
          for (const k of Object.keys(def)) delete def[k];
          def.oneOf = [ copy, { type: 'null' } ];
        }
      }

      makeOptionalRequiredAndNullable(def);
    }
  } else {
    for (const k in schema) makeOptionalRequiredAndNullable(schema[k]);
  }
}

rewriteRefs(parsed);
makeOptionalRequiredAndNullable(parsed.components);

// Dump back to YAML
const updatedYaml = yaml.dump(parsed, { noRefs: true });
fs.writeFileSync(MERGED_FILE, updatedYaml, 'utf8');

console.log(`✅ Updated $ref paths in: ${MERGED_FILE}`);
