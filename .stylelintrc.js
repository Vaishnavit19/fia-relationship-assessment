// .stylelintrc.js
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    // Fix the specific Sass deprecation issue
    "selector-class-pattern": null,
    'scss/no-global-function-names': null,
    'order/properties-alphabetical-order': true,
    
    // Ensure declarations come before nested rules
    'order/order': [
      'custom-properties',
      'declarations',
      'rules',
    ],
    
    // SCSS specific rules
    'scss/at-rule-no-unknown': true,
    'scss/at-import-partial-extension': null,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9-]*$',
    
    // Allow modern CSS features
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes', 'compose-with'],
      },
    ],
    
    // CSS Modules support
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
  },
  ignoreFiles: [
    'node_modules/**/*',
    '.next/**/*',
    'out/**/*',
    'build/**/*',
    'dist/**/*',
  ],
};