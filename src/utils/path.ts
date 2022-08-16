import { join } from "node:path"

export function joinCWDPath(path: string) {
  return join(process.cwd(), path)
}
