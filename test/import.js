const { injectAsync } = require('../dist')
const path = require('node:path')

async function run() {
  try {
    await injectAsync({
      input: path.resolve(__dirname, '../examples/y-env1.yaml'),
      output: path.resolve(__dirname, '../outputs/a.ts'),
      mode: 'test',
    })
  } catch (err) {
    console.error('fail with error: ', err)
  }
}
run()
