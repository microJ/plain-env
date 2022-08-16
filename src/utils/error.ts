import { bold, red } from "colorette"

export function throwError(msg: string): never {
  console.error(bold("[plain-env] Error:"), red(msg))
  throw Error()
}
