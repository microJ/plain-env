import cac, { CAC } from "cac"
import { version, name as pkgName } from "../package.json"
import { ConfigFileType, Module, TargetType } from "./type.t"
import {
  checkDotenvFile,
  checkJsonFile,
  checkTsFile,
  checkYamlFile,
} from "./utils/check"
import { throwError } from "./utils/error"
import { loadFileAsync, writeFileAsync } from "./utils/file"
import { resolveYamlFile } from "./utils/resolveYaml"
import { joinCWDPath } from "./utils/path"

export async function mainAsync() {
  const cli = cac(pkgName)
  cli.version(version)
  cli.help()

  mountMainCommand(cli)

  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()

  return undefined
}

function mountMainCommand(cli: CAC) {
  cli
    .command(
      "build [...(input=output)]",
      "Auto generate ts/js file from config file and env"
    )
    .option(
      "--watch <path>",
      "Watch mode, if path is not specified, it watches the `--dir` option. Repeat '--watch' for more than one path"
    )
    .option(
      "--inject <ENV=val>",
      "Inject env to config file. Repeat '--inject' for more than one env"
    )
    .option(
      "--module <esm, cjs>",
      "Specify output file module type, es-module or common-js",
      {
        default: "esm",
      }
    )
    .option(
      "--mode <your config mode>",
      "will auto pick like `single`"
    )
    .action(async (rules: string[], opts) => {
      // console.log(rules, opts)

      for (let i = 0; i < rules.length; i++) {
        const { inputFile, inputLang, targetFile, targetLang } =
          resolveInputRule(rules[i])

        if (inputLang == null) {
          throwError("input file should be json,yaml,dotenv")
        }

        // 1. try load mode file
        const fileContent = await loadFileAsync(inputFile)

        // 2. parse file and mix env
        const result = resolveFileToTarget(fileContent, {
          type: inputLang,
          targetType: targetLang,
          module: opts.module,
        })

        // console.log("=== parse result:")
        // console.log(result)
        // 3. write file
        await writeFileAsync(targetFile, result)
      }
    })
}

function resolveInputRule(rule: string) {
  const [input, output] = rule.split("=")

  const inputLang: ConfigFileType | null = checkJsonFile(input)
    ? "json"
    : checkYamlFile(input)
    ? "yaml"
    : checkDotenvFile(input)
    ? "dotenv"
    : null
  const inputFile = joinCWDPath(input)

  const targetLang: TargetType = checkTsFile(output) ? "ts" : "js"
  const targetFile = joinCWDPath(output)

  return {
    inputFile,
    inputLang,
    targetFile,
    targetLang,
  }
}

type ParseFileOption = {
  type: ConfigFileType
  targetType: TargetType
  module: Module
}

function resolveFileToTarget(
  content: string,
  { type, targetType, module }: ParseFileOption
) {
  if (type === "yaml") {
    const result = resolveYamlFile(content, targetType, module)
    return result
  }

  return null
}
