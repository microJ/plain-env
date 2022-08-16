import { throwError } from "./error"
import { readFile, outputFile } from "fs-extra"

export async function loadFileAsync(path: string) {
  try {
    const file = await readFile(path, "utf-8")
    return file
  } catch (err) {
    console.error(err)
    throwError(`cannot access ${path}`)
  }
}

export async function writeFileAsync(path: string, data: any) {
  try {
    await outputFile(path, data)
  } catch (err) {
    console.error(err)
    throwError(`cannot write ${path}`)
  }
}
