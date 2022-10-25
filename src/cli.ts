import cac, { CAC } from 'cac'
import { existsSync } from 'node:fs'
import { version, name as pkgName } from '../package.json'
import { ConfigFileType, Module, TargetType } from './type.t'
import {
  checkDotenvFile,
  checkJsonFile,
  checkTsFile,
  checkYamlFile,
} from './utils/check'
import { throwError } from './utils/error'
import { loadFileAsync, writeFileAsync } from './utils/file'
import { resolveYamlFile } from './utils/resolveYaml'
import { joinPath } from './utils/path'

export async function mainAsync() {
  const cli = cac(pkgName)
  cli.version(version)
  cli.help()

  mountMainCommand(cli)

  const parsed = cli.parse(process.argv, { run: false })
  // console.log(parsed)
  await cli.runMatchedCommand()

  return undefined
}

function mountMainCommand(cli: CAC) {
  cli
    .command(
      '[...(input=output)]',
      '`plain-env` is a framework-agnostic `.env` and `Webpack.DefinePlugin` replacement, making business code cleaner, safer, better support `tree-shaking` and code inspection. More info see: https://github.com/microJ/plain-env'
    )
    .option(
      '--mode <runtime/deploy env>',
      'Auto pick target sub-config like `CONFIG_MAP[mode]`'
    )
    .option(
      '--inject <VAR=val>',
      "Inject var to config file, higher priority than process.env[VAR]. Repeat '--inject' for more injecting"
    )
    .option(
      '--module <esm, cjs>',
      'Specify output file module type, es-module or common-js',
      {
        default: 'esm',
      }
    )
    .option('--watch', 'Watch mode, any input file will be watching')
    .action(async (args: string[], opts) => {
      // console.log(args, opts)

      for (let i = 0; i < args.length; i++) {
        const { inputFile, targetFile } = resolveInputRule(args[i])
        await injectAsync({
          input: inputFile,
          output: targetFile,
          module: opts.module,
          mode: opts.mode,
        })
      }
    })
}

type InjectParams = {
  /** Your env config file path */
  input: string
  /** Config file with esm-export or cjs-exports */
  output: string
  /** 'esm' or 'cjs', default is 'esm' */
  module?: Module
  /** Your env config mode */
  mode: string
}

/**
 * Inject your input yaml file to your project that output ts or js file with esm or cjs
 * @param param0 Config for process
 */
export async function injectAsync({
  input,
  output,
  mode,
  module,
}: InjectParams) {
  const _input = joinPath(input)
  if (!existsSync(_input)) {
    throwError(`File '${_input}' doesn't exsits`)
  }

  if (!checkYamlFile(_input)) {
    throwError('Input file should be yaml')
  }

  // 1. try load mode file
  const fileContent = await loadFileAsync(_input)

  // 2. parse file and mix env
  const result = resolveFileToTarget(fileContent, {
    type: 'yaml',
    targetType: getTargetLang(output),
    module: module || 'esm',
    mode,
  })

  // console.log("=== parse result:")
  // console.log(result)
  // 3. write file
  await writeFileAsync(joinPath(output), result)
}

function resolveInputRule(rule: string) {
  const [input, output] = rule.split('=')
  if (!input || !output) {
    throwError(
      `args '${rule}' must be 'input=output', such as './config.yaml=./src/config.ts'`
    )
  }

  const inputFile = joinPath(input)
  const targetFile = joinPath(output)

  return {
    inputFile,
    targetFile,
  }
}

/**
 * Get input file type
 * @param input Input file path
 * @returns 'json' | 'yaml' | 'dotenv'
 */
function getInputLang(input: string) {
  return checkJsonFile(input)
    ? 'json'
    : checkYamlFile(input)
    ? 'yaml'
    : checkDotenvFile(input)
    ? 'dotenv'
    : null
}

/**
 * Get output file type
 * @param target Target file path
 * @returns 'ts' | 'js'
 */
function getTargetLang(target: string) {
  return checkTsFile(target) ? 'ts' : 'js'
}

type ParseFileOption = {
  type: ConfigFileType
  targetType: TargetType
  module: Module
  mode: string
}

function resolveFileToTarget(
  content: string,
  { type, targetType, module, mode }: ParseFileOption
) {
  if (type === 'yaml') {
    const result = resolveYamlFile(content, targetType, module, mode)
    return result
  }

  return null
}
