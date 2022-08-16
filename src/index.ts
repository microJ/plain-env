#!/bin/env node

import { mainAsync } from "./cli"

mainAsync().catch((err) => {
  console.error(err)
})
