import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const version = process.env.VERSION || require('./package.json').version

// CommonJS (for Node), ES module (for bundlers) and browser-friendly UMD build.
export default {
  banner: `/* vue-keycloak-js v${version} */`,
  input: 'src/index.js',
  output: [
    {file: pkg.main, format: 'cjs'},
    {file: pkg.module, format: 'es'},
    {file: pkg.browser, format: 'umd'}
  ],
  name: 'dsb-vue-keycloak',
  plugins: [
    resolve(), // so Rollup can find `keycloak-js`
    commonjs(), // so Rollup can convert `keycloak-js` to an ES module
    babel({
      exclude: ['node_modules/**']
    })
  ]
}

