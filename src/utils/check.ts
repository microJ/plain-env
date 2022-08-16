export function checkJsonFile(file: string) {
  return /\.jsonc?$/.test(file)
}

export function checkYamlFile(file: string) {
  return /\.ya?ml$/.test(file)
}

export function checkDotenvFile(file: string) {
  return /^\.env\b(?!\.(jsx?|tsx?|jsonc?|ya?ml))/.test(file)
}

export function checkTsFile(file: string) {
  return /\.tsx?$/.test(file)
}

export function checkString(str: unknown): str is string {
  return typeof str === "string"
}
