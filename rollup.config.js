import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = process.env.VERSION || require('./package.json').version
const banner = `/*!
  * vue-keycloak-js v${version}
  * @license ISC
  */`
const name = 'dsb-vue-keycloak'
const globals = {
  '@vue/reactivity': 'Reactivity',
  'keycloak-js': 'Keycloak',
  'vue': 'Vue'
}
const inlineDynamicImports = true

// CommonJS (for Node), ES module (for bundlers) and browser-friendly UMD build.
export default {
  input: 'src/index.ts',
  output: [
    {
      exports: 'default',
      file: pkg.main,
      format: 'cjs',
      banner,
      name,
      globals,
      inlineDynamicImports
    },
    {
      exports: 'default',
      file: pkg.module,
      format: 'es',
      banner,
      name,
      globals,
      inlineDynamicImports
    },
    {
      exports: 'default',
      file: pkg.browser,
      format: 'umd',
      banner,
      name,
      globals,
      inlineDynamicImports
    }
  ],
  plugins: [
    resolve(), // so Rollup can find `keycloak-js`
    commonjs(), // so Rollup can convert `keycloak-js` to an ES module
    typescript({
      tsconfigOverride: {
        include: ['src/**/*'],
        exclude: ['node_modules'],
      },
    }),
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled',
    }),
  ],
  external: ['vue', 'keycloak-js'],
}
