const { injectAsync } = require('../dist/index.js')
const path = require('node:path')

async function run() {
  try {
    await injectAsync({
      input: path.resolve(__dirname, '../examples/y-env1.yaml'),
      output: path.resolve(__dirname, '../outputs/a.ts'),
      mode: 'test',
      config: {
        SHOW_ME_CODE: 'cool',
        run_some_thing: 123,
        extra_var: null,
        extra_object: {
          hello: 'world',
        },
      },
    })
  } catch (err) {
    console.error('fail with error: ', err)
  }
}
run()
