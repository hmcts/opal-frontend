// eslint.config.js
//
// ESLint 9 flat-config for a mixed Angular + Cypress repo.
// - Angular app linting (src/**) similar to previous .eslintrc.json
// - Cypress linting (cypress/**) low-noise baseline + strict framework docs
// - Inline Angular templates handled via processor: extract-inline-html
//

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

import angular from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

import jsdoc from 'eslint-plugin-jsdoc';

export default [
  // ------------------------------------------------------------
  // Global ignores
  // ------------------------------------------------------------
  {
    ignores: ['projects/**/*', 'node_modules/**/*', 'dist/**/*', 'out-tsc/**/*', 'coverage/**/*'],
  },

  // ------------------------------------------------------------
  // Do not warn on unused eslint-disable directives
  // ------------------------------------------------------------
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },

  // ------------------------------------------------------------
  // ANGULAR app TS (src/**/*.ts)
  // Mirrors prior .eslintrc.json extends + rules.
  // Also enables inline-template extraction.
  // ------------------------------------------------------------
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    // Enables linting of inline templates inside component TS files
    // by extracting them into virtual HTML for the template rules. :contentReference[oaicite:1]{index=1}
    processor: angularTemplatePlugin.processors['extract-inline-html'],

    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angular,
    },
    rules: {
      // In TS projects this rule creates noise; TS compiler covers it
      'no-undef': 'off',

      // Similar to: "plugin:@typescript-eslint/recommended"
      ...tsPlugin.configs.recommended.rules,

      // Similar to: "plugin:@angular-eslint/recommended"
      ...angular.configs.recommended.rules,

      // Your previous custom rules
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'private-static-field',
            'protected-static-field',
            'public-static-field',
            'private-instance-field',
            'protected-instance-field',
            'public-instance-field',
            'constructor',
            'private-static-method',
            'protected-static-method',
            'public-static-method',
            'private-instance-method',
            'protected-instance-method',
            'public-instance-method',
          ],
        },
      ],
    },
  },

  // ------------------------------------------------------------
  // ANGULAR templates (src/**/*.html) + extracted inline templates
  // This block will lint:
  // - real .html files under src/
  // - virtual HTML extracted from inline templates
  // ------------------------------------------------------------
  {
    files: ['src/**/*.html', '**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
      ...angularTemplatePlugin.configs.accessibility.rules,
    },
  },

  // ------------------------------------------------------------
  // CYPRESS baseline (LOW NOISE): cypress/**/*.ts
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
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // ------------------------------------------------------------
  // CYPRESS framework code (STRICT): docs + TS hygiene
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
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

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
      'jsdoc/require-description': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
    },
  },

  // ------------------------------------------------------------
  // newStyleSteps: allow semantic + technical tags
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
  // Actions / Flows / Selectors: allow 4 technical tags everywhere
  // ------------------------------------------------------------
  {
    files: [
      'cypress/e2e/functional/opal/**/actions/**/*.ts',
      'cypress/e2e/functional/opal/**/flows/**/*.ts',
      'cypress/shared/selectors/**/*.ts',
    ],
    rules: {
      'jsdoc/check-tag-names': ['error', { definedTags: ['remarks', 'details', 'note', 'example'] }],
    },
  },
];
