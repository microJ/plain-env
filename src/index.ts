#!/usr/bin/env node

import { mainAsync } from './cli'
import { throwError } from './utils/error'
export { injectAsync } from './cli'
import { fileURLToPath } from 'node:url'

if (checkCli()) {
  mainAsync().catch((err) => {
    throwError(err)
  })
}

/**
 * Check this module run directly with Node.js
 */
function checkCli() {
  // es-module
  if (require.main === undefined) {
    // @ts-ignore: compat ES-Module
    return fileURLToPath(import.meta.url) === process.argv[1]
  }
  // common-js
  else {
    return require.main === module
  }
}
