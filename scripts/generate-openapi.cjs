const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const OPENAPI_SPEC = path.resolve(__dirname, '../openapi/opal-merged.yaml');
const OPENAPI_TEMPLATES = path.resolve(__dirname, '../openapi/templates');
const OUTPUT_DIR = path.resolve(__dirname, '../src/app/generated/api-client');
const APP_DIR = path.resolve(__dirname, '../src/app/flows/fines/services/opal-fines-service');
const INTERFACES_DIR = path.join(APP_DIR, 'interfaces', 'generated');
const TYPES_DIR = path.join(APP_DIR, 'types');
const GENERATOR_CLI = 'npx';

// Function to clean up response interface names (remove HTTP status codes)
function cleanInterfaceName(name) {
  // Remove common HTTP status codes from interface names
  return name
    .replace(/200Response/g, 'Response')
    .replace(/201Response/g, 'Response')
    .replace(/204Response/g, 'Response')
    .replace(/400Response/g, 'ErrorResponse')
    .replace(/401Response/g, 'UnauthorizedResponse')
    .replace(/403Response/g, 'ForbiddenResponse')
    .replace(/404Response/g, 'NotFoundResponse')
    .replace(/500Response/g, 'ServerErrorResponse');
}

// Function to extract type dependencies from interface content
function extractTypeDependencies(content) {
  // More precise regex to match actual type references, avoiding partial matches
  const typeUsageRegex = /(?::\s*)([A-Z][A-Za-z0-9]*(?:Enum|Type))(?=\s*(?:\||;))/g;
  const dependencies = new Set();
  let match;

  while ((match = typeUsageRegex.exec(content)) !== null) {
    dependencies.add(match[1]);
  }

  return Array.from(dependencies);
}

// Function to extract interface dependencies from interface content
function extractInterfaceDependencies(content) {
  // More comprehensive regex that captures any interface reference (starts with capital letter)
  const interfaceUsageRegex =
    /(?::\s*|Array<|Set<)([A-Z][A-Za-z0-9_]*(?:Response|Request|Common|Details|Summary|Reference|Override|Terms|Creditor|Defendant|Account|Payment))(?:\>|;|\s|\|)/g;
  const dependencies = new Set();
  let match;

  while ((match = interfaceUsageRegex.exec(content)) !== null) {
    dependencies.add(match[1]);
  }

  return Array.from(dependencies);
}

// Function to generate import statements for types
function generateTypeImports(typeDependencies) {
  if (typeDependencies.length === 0) return '';

  const imports = typeDependencies
    .map((typeName) => {
      const typeFileName = `opal-fines-${typeName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')}.type`;
      return `import type { ${typeName} } from '../../types/${typeFileName}';`;
    })
    .join('\n');

  return imports + '\n\n';
}

// Function to generate import statements for interfaces
function generateInterfaceImports(interfaceDependencies) {
  if (interfaceDependencies.length === 0) return '';

  const imports = interfaceDependencies
    .map((interfaceName) => {
      const interfaceFileName = `opal-fines-${interfaceName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')}.interface`;
      return `import type { ${interfaceName} } from './${interfaceFileName}';`;
    })
    .join('\n');

  return imports + '\n\n';
}

// Function to fix TypeScript issues in interface content
function fixTypeScriptIssues(content) {
  let fixedContent = content;

  // Fix 1: Convert optional fields from ?: to | null
  // This handles cases like "field?: Type" to "field: Type | null"
  fixedContent = fixedContent.replace(/(\w+)\?\s*:\s*([^;]+);/g, '$1: $2 | null;');

  // Fix 2: Convert enum types to proper TypeScript type references
  // This handles cases like ": EnumName" to ": typeof EnumName[keyof typeof EnumName]"
  fixedContent = fixedContent.replace(/:\s*([A-Z][A-Za-z0-9]*Enum)(?!\[)/g, ': typeof $1[keyof typeof $1]');

  // Fix 3: Clean up irregular whitespace characters (non-breaking spaces, etc.)
  // This prevents ESLint "no-irregular-whitespace" errors
  fixedContent = fixedContent.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');

  return fixedContent;
}

// Clean the output directory
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}

console.log(`🔧 Generating TypeScript interfaces from: ${OPENAPI_SPEC}`);

const result = spawnSync(
  GENERATOR_CLI,
  [
    '@openapitools/openapi-generator-cli',
    'generate',
    '-i',
    OPENAPI_SPEC,
    '-g',
    'typescript-fetch',
    '-o',
    OUTPUT_DIR,
    '--skip-validate-spec',
    '--additional-properties=supportsES6=true,modelPropertyNaming=original,withoutRuntimeChecks=true',
  ],
  {
    stdio: 'inherit',
  },
);

if (result.status !== 0) {
  console.error(`❌ Failed to generate TypeScript interfaces from merged spec`);
  process.exit(result.status || 1);
}

// Clean up: Remove APIs and other unnecessary files, keep only models
const apisDir = path.join(OUTPUT_DIR, 'apis');
const runtimeDir = path.join(OUTPUT_DIR, 'runtime');
const docsDir = path.join(OUTPUT_DIR, 'docs');
const filesToRemove = [
  path.join(OUTPUT_DIR, '.openapi-generator'),
  path.join(OUTPUT_DIR, '.openapi-generator-ignore'),
  path.join(OUTPUT_DIR, 'runtime.ts'),
  apisDir,
  runtimeDir,
  docsDir,
];

filesToRemove.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
    console.log(`🗑️ Removed: ${path.relative(OUTPUT_DIR, filePath)}`);
  }
});

// Create index.ts exports for models only
const modelsDir = path.join(OUTPUT_DIR, 'models');
const indexPath = path.join(OUTPUT_DIR, 'index.ts');

if (fs.existsSync(modelsDir)) {
  // Use the models/index.ts directly
  const modelsIndexPath = path.join(modelsDir, 'index.ts');
  if (fs.existsSync(modelsIndexPath)) {
    fs.copyFileSync(modelsIndexPath, indexPath);
    console.log(`📋 Copied models/index.ts to index.ts`);
  }
} else {
  // Fallback if models dir doesn't exist
  fs.writeFileSync(indexPath, '// No models generated\n');
}

// Process and organize interfaces and types
console.log(`\n🎯 Processing and organizing interface and type files...`);

if (fs.existsSync(indexPath)) {
  // Clean up existing directories first
  if (fs.existsSync(INTERFACES_DIR)) {
    fs.rmSync(INTERFACES_DIR, { recursive: true, force: true });
    console.log(`🧹 Cleaned existing interfaces directory`);
  }

  if (fs.existsSync(TYPES_DIR)) {
    fs.rmSync(TYPES_DIR, { recursive: true, force: true });
    console.log(`🧹 Cleaned existing types directory`);
  }

  // Clean up old types directory in interfaces folder if it exists
  const oldTypesDir = path.join(APP_DIR, 'interfaces', 'types');
  if (fs.existsSync(oldTypesDir)) {
    fs.rmSync(oldTypesDir, { recursive: true, force: true });
    console.log(`🧹 Cleaned old interfaces/types directory`);
  }

  // Create directories
  fs.mkdirSync(INTERFACES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${path.relative(process.cwd(), INTERFACES_DIR)}`);

  fs.mkdirSync(TYPES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${path.relative(process.cwd(), TYPES_DIR)}`);

  // Read the generated index.ts file
  const generatedContent = fs.readFileSync(indexPath, 'utf8');

  // Extract individual interfaces and create separate files
  const interfaceRegex = /export interface (\w+) \{[\s\S]*?\n\}/g;
  const enumRegex = /export const (\w+) = \{[\s\S]*?\n\} as const;/g;
  const typeRegex = /export type (\w+) = .*?;/g;

  let interfaceCount = 0;
  let typeCount = 0;
  let match;

  // First pass: Process types and enums (they need to be created first)
  const typeFiles = [];

  // Reset regex indices
  typeRegex.lastIndex = 0;
  enumRegex.lastIndex = 0;

  // Process types
  while ((match = typeRegex.exec(generatedContent)) !== null) {
    const typeName = match[1];
    const typeContent = match[0];
    const cleanedTypeName = cleanInterfaceName(typeName);

    // Convert to kebab-case for filename
    const fileName = `opal-fines-${cleanedTypeName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')}.type.ts`;
    const filePath = path.join(TYPES_DIR, fileName);

    // Create file content without eslint-disable
    const fileContent = `/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

${typeContent.replace(typeName, cleanedTypeName)}
`;

    fs.writeFileSync(filePath, fileContent);
    typeFiles.push({ fileName: fileName.replace('.type.ts', ''), typeName: cleanedTypeName });
    typeCount++;
    console.log(`✅ Generated type: ${fileName}`);
  }

  // Process enums as types
  while ((match = enumRegex.exec(generatedContent)) !== null) {
    const enumName = match[1];
    const enumContent = match[0];
    const cleanedEnumName = cleanInterfaceName(enumName);

    const fileName = `opal-fines-${cleanedEnumName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')}.type.ts`;
    const filePath = path.join(TYPES_DIR, fileName);

    const fileContent = `/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

${enumContent.replace(enumName, cleanedEnumName)}
`;

    fs.writeFileSync(filePath, fileContent);
    typeFiles.push({ fileName: fileName.replace('.type.ts', ''), typeName: cleanedEnumName });
    typeCount++;
    console.log(`✅ Generated enum as type: ${fileName}`);
  }

  // Second pass: Process interfaces (now that types exist)
  const interfaceFiles = [];
  interfaceRegex.lastIndex = 0; // Reset regex index

  while ((match = interfaceRegex.exec(generatedContent)) !== null) {
    const interfaceName = match[1];
    let interfaceContent = match[0];
    const cleanedInterfaceName = cleanInterfaceName(interfaceName);

    // Convert to kebab-case for filename
    const fileName = `opal-fines-${cleanedInterfaceName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')}.interface.ts`;
    const filePath = path.join(INTERFACES_DIR, fileName);

    // Extract type dependencies and generate imports
    const originalTypeDependencies = extractTypeDependencies(interfaceContent);
    const cleanedTypeDependencies = originalTypeDependencies.map((type) => cleanInterfaceName(type));

    // Extract interface dependencies and clean them too
    const originalInterfaceDependencies = extractInterfaceDependencies(interfaceContent);
    const cleanedInterfaceDependencies = originalInterfaceDependencies
      .map((iface) => cleanInterfaceName(iface))
      .filter((iface) => iface !== cleanedInterfaceName); // Exclude self-reference

    const typeImports = generateTypeImports(cleanedTypeDependencies);
    const interfaceImports = generateInterfaceImports(cleanedInterfaceDependencies);

    // Update interface content with cleaned names for both interface and type references
    interfaceContent = interfaceContent.replace(
      new RegExp(`interface ${interfaceName}`, 'g'),
      `interface ${cleanedInterfaceName}`,
    );

    // Replace type references in the interface content
    originalTypeDependencies.forEach((originalType, index) => {
      const cleanedType = cleanedTypeDependencies[index];
      if (originalType !== cleanedType) {
        interfaceContent = interfaceContent.replace(new RegExp(originalType, 'g'), cleanedType);
      }
    });

    // Replace interface references in the interface content
    originalInterfaceDependencies.forEach((originalInterface, index) => {
      const cleanedInterface = cleanedInterfaceDependencies[index];
      if (originalInterface !== cleanedInterface) {
        interfaceContent = interfaceContent.replace(new RegExp(originalInterface, 'g'), cleanedInterface);
      }
    });

    // Fix TypeScript issues
    interfaceContent = fixTypeScriptIssues(interfaceContent);

    // Also clean up JSDoc @memberof tags and @type annotations
    interfaceContent = interfaceContent.replace(
      new RegExp(`@memberof ${interfaceName}`, 'g'),
      `@memberof ${cleanedInterfaceName}`,
    );
    interfaceContent = interfaceContent.replace(
      new RegExp(`@type \\{${interfaceName}\\}`, 'g'),
      `@type {${cleanedInterfaceName}}`,
    );

    // Clean up any remaining @type annotations with 200 responses
    originalInterfaceDependencies.forEach((originalInterface, index) => {
      const cleanedInterface = cleanedInterfaceDependencies[index];
      if (originalInterface !== cleanedInterface) {
        interfaceContent = interfaceContent.replace(
          new RegExp(`@type \\{${originalInterface}\\}`, 'g'),
          `@type {${cleanedInterface}}`,
        );
      }
    });

    // Create file content without eslint-disable but with proper imports
    const allImports = [typeImports, interfaceImports].filter(Boolean).join('');
    const fileContent = `/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

${allImports}${interfaceContent}
`;

    fs.writeFileSync(filePath, fileContent);
    interfaceFiles.push({ fileName: fileName.replace('.interface.ts', ''), interfaceName: cleanedInterfaceName });
    interfaceCount++;
    console.log(`✅ Generated interface: ${fileName}`);
  }

  console.log(`\n🎉 Successfully generated ${interfaceCount} interface files and ${typeCount} type files`);

  console.log(`📋 Generated ${interfaceFiles.length} interface files`);
  console.log(`📋 Generated ${typeFiles.length} type files`);
}

console.log(`✅ TypeScript interfaces generated at: ${OUTPUT_DIR}`);
console.log(`✅ Application interfaces organized at: ${INTERFACES_DIR}`);
console.log(`✅ Application types organized at: ${TYPES_DIR}`);
