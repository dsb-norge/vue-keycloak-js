import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import pkg from './package.json'

const name = 'dsb-vue-keycloak'
const version = process.env.VERSION || pkg.version
const banner = `/*!
  * vue-keycloak-js v${version}
  * @license ISC
  */`

export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `${name}.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'keycloak-js'],
      output: {
        banner,
        exports: 'named',
        globals: {
          vue: 'Vue',
          'keycloak-js': 'Keycloak'
        }
      }
    }
  }
})
