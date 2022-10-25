import { injectAsync } from '../dist/index.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

async function run() {
  try {
    const filename = fileURLToPath(import.meta.url)
    await injectAsync({
      input: path.resolve(filename, '../../examples/y-env1.yaml'),
      output: path.resolve(filename, '../../outputs/a-1.ts'),
      mode: 'prod',
    })
  } catch (err) {
    console.error('fail with error: ', err)
  }
}
run()
