import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const version = process.env.VERSION || require('./package.json').version
const banner =
`/*!
  * vue-keycloak-ts v${version}
  * @license ISC
  */`
const name = 'caassis-vue-keycloak'

// CommonJS (for Node), ES module (for bundlers) and browser-friendly UMD build.
export default {
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs', banner, name },
    { file: pkg.module, format: 'es', banner, name },
    { file: pkg.browser, format: 'umd', banner, name }
  ],
  plugins: [
    resolve(), // so Rollup can find `keycloak-js`
    commonjs(), // so Rollup can convert `keycloak-js` to an ES module
    babel({
      exclude: ['node_modules/**']
    })
  ]
}

