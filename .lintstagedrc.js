// Following Next.js official documentation pattern
// https://nextjs.org/docs/app/api-reference/config/eslint#running-lint-on-staged-files

const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  // Only lint source files to avoid config file issues
  '{src,app,pages,components}/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
  
  // Format all supported files
  '*.{json,md,scss,css,yaml,yml}': ['prettier --write'],
};