import { bold, red } from "colorette"

export function throwError(msg: string): never {
  console.error(bold("[ts-env] Error:"), red(msg))
  throw Error()
}
