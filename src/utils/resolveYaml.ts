import {
  parseAllDocuments,
  Document,
  ParsedNode,
  YAMLMap,
  YAMLSeq,
  Scalar,
  Pair,
  isScalar,
  isMap,
  parse,
} from "yaml"
import { Module, TargetType } from "../type.t"
import { checkString } from "./check"
import { genJSComment, genOneLineJSComment, genStringConcat } from "./util"
type Doc = Document.Parsed<ParsedNode>

export function resolveYamlFile(
  content: string,
  targetType: TargetType,
  module: Module
) {
  const normalizedFile = parseAllDocuments(content)
  // console.log("normalizedFile:")
  // console.log(normalizedFile)
  const { getContent, concatContent } = genStringConcat()

  normalizedFile.forEach((doc) => {
    concatContent(resolveDocument(doc, targetType, module))
  })
  return getContent()
}

function resolveDocument(
  node: Doc,
  targetType: TargetType,
  module: Module
): string {
  const { getContent, concatContent } = genStringConcat()
  // console.log("Doc: ", node)

  concatContent(resolveLineBefore(node))

  if (node.contents) {
    concatContent(resolveContents(node.contents, targetType, module))
  }

  const docEndComment = `\n${resolveCommentAfter(node)}\n`
  concatContent(docEndComment)

  return getContent()
}

function resolveContents(
  contents: ParsedNode,
  targetType: TargetType,
  module: Module
): string {
  const { getContent, concatContent } = genStringConcat()

  concatContent(`${resolveLineBefore(contents)}\n`)

  if (isMap(contents)) {
    contents.items.forEach((cont) => {
      const { key, value } = cont
      concatContent(resolveLineBefore(key))
      if (value) {
        const jsValue = resolveValue(value)
        const langExportLeft =
          module === "cjs" ? `exports.${key}` : `export const ${key}`
        const isClearJSType =
          [undefined, null, Infinity, -Infinity].some((v) => v === jsValue) ||
          Number.isNaN(jsValue)
        const expressionRightEnd =
          targetType === "js" ? "" : isClearJSType ? "" : " as const"
        concatContent(`\n${langExportLeft} = ${jsValue}${expressionRightEnd}`)
        concatContent(resolveCommentAfter(value))
      }
    })
  }

  if (checkString(contents.comment)) {
    concatContent(genJSComment(contents.comment))
  }

  return getContent()
}

function resolveValue(value: ParsedNode): any {
  // console.log(value, isScalar(value))
  if (isScalar(value)) {
    // console.log(typeof value.value)
    // console.log(parse(value.source))
    if (typeof value.value === "string") {
      return JSON.stringify(value.value)
    } else {
      return value.value
    }
  } else {
    return `${value}`
  }
}

function resolveLineBefore<
  T extends { commentBefore?: string | null; spaceBefore?: boolean }
>(node: T): string {
  const { getContent, concatContent } = genStringConcat()
  if (node.spaceBefore) {
    concatContent("\n")
  }
  if (checkString(node.commentBefore)) {
    // handle multi-line comments
    const comments = replaceMultiLineBreak(node.commentBefore)
    concatContent(genOneLineJSComment(comments))
  }

  return getContent()
}

function resolveCommentAfter<T extends { comment?: string | null }>(
  node: T
): string {
  return checkString(node.comment) ? ` ${genJSComment(node.comment)}` : ""
}

/**
 * match /\n+/g and replace
 * if match is end of whole string, don't replace
 * else replace last substring \n of matched witch '\n//'
 * @param str
 * @returns
 */
function replaceMultiLineBreak(str: string): string {
  const lastLineBreakMatch = str.match(/(\n+)$/g)
  let lastLineBreak = ""
  let slimmerStr = str
  if (lastLineBreakMatch) {
    lastLineBreak = lastLineBreakMatch[0]
    slimmerStr = str.slice(0, -lastLineBreak.length)
  }

  return (
    slimmerStr.replace(/\n+/g, (substring, ...args) => {
      const offset = args[-2]
      const match1 = substring.match(/\n/g)
      if (!match1) return substring

      const count = match1.length
      if (count === 1) {
        return "\n//"
      } else {
        return `${new Array(count - 1).fill("\n").join("")}\n//`
      }
    }) + lastLineBreak
  )
}
