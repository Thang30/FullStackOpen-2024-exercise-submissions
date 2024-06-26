import globals from "globals"
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': 'off',
      '@stylistic/js/linebreak-style': 'off',
      '@stylistic/js/quotes': 'off',
      '@stylistic/js/semi': 'off',
      'eqeqeq': 'off',
      'no-trailing-spaces': 'off',
      'object-curly-spacing': 'off',
      'arrow-spacing': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: ["dist/**", "build/**"],
  },
]
