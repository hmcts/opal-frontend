// eslint.config.js
//
// ESLint 9 (flat config) for a mixed Angular + Cypress repo.
//
// Design goals:
// - Angular app code is linted by `ng lint` (Angular ESLint builder)
// - ESLint focuses on Cypress automation only
// - Cypress framework code is held to higher documentation standards
// - Legacy step definitions are not disturbed
//

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  // ------------------------------------------------------------
  // Global ignores (safe)
  // ------------------------------------------------------------
  {
    ignores: ['projects/**/*', 'node_modules/**/*', 'dist/**/*', 'out-tsc/**/*', 'coverage/**/*'],
  },

  // ------------------------------------------------------------
  // Angular SOURCE passthrough
  // Required so `ng lint` does not fail with
  // "All files matching patterns are ignored".
  // Actual Angular rules are owned by the Angular ESLint builder.
  // ------------------------------------------------------------
  {
    files: ['src/**/*.ts', 'src/**/*.html'],
    rules: {},
  },

  // ------------------------------------------------------------
  // Cypress TypeScript BASELINE (LOW NOISE)
  // Applies to ALL Cypress TS files, including legacy steps/tests.
  // Intentionally relaxed.
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
      // Cypress globals (cy, Cypress) are handled by TS typings
      'no-undef': 'off',

      // Legacy steps often rely on unused args
      '@typescript-eslint/no-unused-vars': 'off',

      // Pragmatic Cypress patterns
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // ------------------------------------------------------------
  // Cypress FRAMEWORK CODE (STRICT)
  // Enforces TS hygiene + mandatory docblocks.
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

      // Require docblocks (including private methods)
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

      // Require at least a description ("metadata")
      'jsdoc/require-description': 'error',

      // Core JSDoc validation
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-param': 'error',

      // Returns enforcement (warn if this ever becomes noisy)
      'jsdoc/require-returns': 'error',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
    },
  },

  // ------------------------------------------------------------
  // newStyleSteps: SEMANTIC + TECHNICAL documentation
  // ------------------------------------------------------------
  {
    files: ['cypress/support/step_definitions/newStyleSteps/**/*.ts'],
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['step', 'precondition', 'details', 'table', 'remarks', 'note', 'example'],
        },
      ],
    },
  },

  // ------------------------------------------------------------
  // Framework layers (actions / flows / selectors):
  // TECHNICAL documentation only
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
          definedTags: ['remarks', 'details', 'note', 'example'],
        },
      ],
    },
  },
];
