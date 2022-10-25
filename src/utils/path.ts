import { join, isAbsolute } from 'node:path'

export function joinPath(path: string) {
  return isAbsolute(path) ? path : join(process.cwd(), path)
}
