// eslint.config.js
//
// ESLint is scoped to Cypress automation only.
// - Angular app code is linted via `ng lint`
// - Cypress framework code is held to higher standards
// - Legacy step definitions remain unaffected
//
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    // Keep ESLint out of build output and dependency folders
    ignores: ['projects/**/*', 'node_modules/**/*', 'dist/**/*', 'out-tsc/**/*', 'coverage/**/*'],
  },

  // ------------------------------------------------------------
  // Cypress TypeScript baseline (LOW NOISE)
  // Applies to all Cypress TS files, including legacy tests.
  // Intentionally relaxed to avoid breaking existing code.
  // ------------------------------------------------------------
  {
    files: ['cypress/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jsdoc,
    },
    rules: {
      // Cypress globals (e.g. `cy`) are handled by TypeScript
      'no-undef': 'off',

      // Do NOT enforce unused vars globally (legacy steps rely on this)
      '@typescript-eslint/no-unused-vars': 'off',

      // Allow pragmatic Cypress patterns
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // ------------------------------------------------------------
  // Cypress FRAMEWORK CODE (STRICT)
  // Enforces TS hygiene + TSDoc metadata for:
  // - actions / flows
  // - support utils
  // - new-style step definitions
  // - shared selectors
  // ------------------------------------------------------------
  {
    files: [
      'cypress/e2e/functional/opal/**/actions/**/*.ts',
      'cypress/e2e/functional/opal/**/flows/**/*.ts',
      'cypress/support/utils/**/*.ts',
      'cypress/support/step_definitions/newStyleSteps/**/*.ts',
      'cypress/shared/selectors/**/*.ts',
    ],
    rules: {
      // TS hygiene where it actually matters
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Require docblocks on framework code (including private methods)
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ClassDeclaration: true,
            MethodDefinition: true,
            FunctionDeclaration: true,
          },
          publicOnly: false,
        },
      ],

      // Ensure every docblock has at least a description ("metadata")
      'jsdoc/require-description': 'error',

      // JSDoc correctness
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-param': 'error',

      // Returns enforcement (change to "warn" if it ever gets noisy)
      'jsdoc/require-returns': 'error',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
    },
  },

  // ------------------------------------------------------------
  // newStyleSteps: allow step-specific metadata tags
  // Semantic Gherkin documentation lives ONLY here.
  // ------------------------------------------------------------
  {
    files: ['cypress/support/step_definitions/newStyleSteps/**/*.ts'],
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['step', 'precondition', 'details', 'example', 'remarks', 'table', 'note'],
        },
      ],
    },
  },

  // ------------------------------------------------------------
  // selectors: allow technical documentation tags
  // No step semantics here – only implementation context.
  // ------------------------------------------------------------
  {
    files: [
      'cypress/e2e/functional/opal/**/actions/**/*.ts',
      'cypress/e2e/functional/opal/**/flows/**/*.ts',
      'cypress/shared/selectors/**/*.ts',
    ],
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['actions', 'delegates', 'details', 'example', 'flow', 'note', 'remarks', 'validations'],
        },
      ],
    },
  },
];
