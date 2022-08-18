import cac, { CAC } from "cac";
import { version, name as pkgName } from "../package.json";
import { ConfigFileType, Module, TargetType } from "./type.t";
import {
  checkDotenvFile,
  checkJsonFile,
  checkTsFile,
  checkYamlFile,
} from "./utils/check";
import { throwError } from "./utils/error";
import { loadFileAsync, writeFileAsync } from "./utils/file";
import { resolveYamlFile } from "./utils/resolveYaml";
import { joinCWDPath } from "./utils/path";

export async function mainAsync() {
  const cli = cac(pkgName);
  cli.version(version);
  cli.help();

  mountMainCommand(cli);

  const parsed = cli.parse(process.argv, { run: false });
  // console.log(parsed)
  await cli.runMatchedCommand();

  return undefined;
}

function mountMainCommand(cli: CAC) {
  cli
    .command(
      "[...(input=output)]",
      "`plain-env` is a framework-agnostic `.env` and `Webpack.DefinePlugin` replacement, making business code cleaner, safer, better support `tree-shaking` and code inspection. More info see: https://github.com/microJ/plain-env"
    )
    .option(
      "--mode <runtime/deploy env>",
      "Auto pick target sub-config like `CONFIG_MAP[mode]`"
    )
    .option(
      "--inject <VAR=val>",
      "Inject var to config file, higher priority than process.env[VAR]. Repeat '--inject' for more injecting"
    )
    .option(
      "--module <esm, cjs>",
      "Specify output file module type, es-module or common-js",
      {
        default: "esm",
      }
    )
    .option("--watch", "Watch mode, any input file will be watching")
    .action(async (args: string[], opts) => {
      // console.log(args, opts)

      for (let i = 0; i < args.length; i++) {
        const { inputFile, inputLang, targetFile, targetLang } =
          resolveInputRule(args[i]);

        if (inputLang == null) {
          throwError("input file should be json,yaml,dotenv");
        }

        // 1. try load mode file
        const fileContent = await loadFileAsync(inputFile);

        // 2. parse file and mix env
        const result = resolveFileToTarget(fileContent, {
          type: inputLang,
          targetType: targetLang,
          module: opts.module,
          mode: opts.mode,
        });

        // console.log("=== parse result:")
        // console.log(result)
        // 3. write file
        await writeFileAsync(targetFile, result);
      }
    });
}

function resolveInputRule(rule: string) {
  const [input, output] = rule.split("=");
  if (!input || !output) {
    throwError(
      `args '${rule}' must be 'input=output', such as './config.yaml=./src/config.ts'`
    );
  }

  const inputLang: ConfigFileType | null = checkJsonFile(input)
    ? "json"
    : checkYamlFile(input)
    ? "yaml"
    : checkDotenvFile(input)
    ? "dotenv"
    : null;
  const inputFile = joinCWDPath(input);

  const targetLang: TargetType = checkTsFile(output) ? "ts" : "js";
  const targetFile = joinCWDPath(output);

  return {
    inputFile,
    inputLang,
    targetFile,
    targetLang,
  };
}

type ParseFileOption = {
  type: ConfigFileType;
  targetType: TargetType;
  module: Module;
  mode: string;
};

function resolveFileToTarget(
  content: string,
  { type, targetType, module, mode }: ParseFileOption
) {
  if (type === "yaml") {
    const result = resolveYamlFile(content, targetType, module, mode);
    return result;
  }

  return null;
}
