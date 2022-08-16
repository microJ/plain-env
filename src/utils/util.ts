/**
 * util for string concat continually
 * @param initialStr
 * @returns
 */
export function genStringConcat(initialStr = "") {
  let content = initialStr
  const concatContent = (val: string) => (content += val)
  const getContent = () => content

  return {
    getContent,
    concatContent,
  }
}

export function genJSComment(comment: string) {
  return `// ${comment.trim()}`
}

export function genOneLineJSComment(comment: string) {
  return `\n// ${comment.trim()}`
}