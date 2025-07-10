/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'es5',
  singleQuote: true,
  semi: false,
  printWidth: 100,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@config/(.*)$', '^@lib/(.*)$', '^[./]'],
  tailwindStylesheet: '@/lib/styles/globals.css',
  overrides: [
    {
      files: ['tsconfig*.json'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
}

export default config
