#!/usr/bin/env node

import { mainAsync } from './cli'
import { throwError } from './utils/error'
export { injectAsync } from './cli'

mainAsync().catch((err) => {
  throwError(err)
})
