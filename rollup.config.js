import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/main.js',
    format: 'esm'
  },
  plugins: [babel({ babelHelpers: 'bundled' }), terser()]
};

export default config;