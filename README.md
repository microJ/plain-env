# plain-env

[![npm](https://img.shields.io/npm/v/plain-env?label=plain-env)](https://www.npmjs.com/package/plain-env)
![npm type definitions](https://img.shields.io/npm/types/typescript)
![module system](https://img.shields.io/badge/Module%20System-CommonJS%20%26%20ES--Module-green)
![file support](https://img.shields.io/badge/file-yaml-green)

`plain-env` is a framework-agnostic `.env` and `Webpack.DefinePlugin` replacement, making business code cleaner, safer, better support `tree-shaking` and code inspection.

`plain-env` 是框架无关的 `.env` 和 `Webpack.DefinePlugin` 的替代品，让业务代码更干净、更安全、更好的支持 `tree-shaking` 和代码检查。

## 为什么是 plain-env

1. `plain-env` 的使用与工程框架完全解耦，提供命令行和 Node.js 支持。

   以前通过 `Webpack.DefinePlugin` 动态注入并替换业务代码中的 `process.env.xx` 的耦合方式。

   现在只需要 `import {xx} from "./config.ts"` 即可。

2. `plain-env` 通过解析配置声明文件自动生成 TS/JS 文件，通过 `import` 在业务代码中使用。

   绝佳的隔离了工程环境和业务环境。

   同时保留了注释在 IDE 中的提示。

3. `plain-env` 支持自动选择对应部署环境的子配置，拒绝导出一切无用信息，防止误用。

4. `plain-env` 支持从 `CI/CD` 中接受环境变量的注入，避免关键信息配置在代码仓库中有泄漏风险。

5. TS/JS 的静态化导出有更好的支持类型提示、打包过程的静态错误检查和 `tree-shaking`。

   完全规避掉了前端业务代码中使用 `process.env` 的缺点。

## 特性

- 简单、灵活、易用
- 框架无关
- 支持命令行 `plain-env ...`
- 自动注入系统环境变量 `process.env.xx` / --inject
- 自定义输出环境 `--mode`
- 配置项类型的近乎完备支持
- TS/JS 双运行环境支持
- 运行时安全、信息安全
- 保留完整注释

TODO:

- [ ] 通过 `import`/`require` 使用
- [ ] 多文件类型支持
- [ ] 测试用例
- [ ] --watch
- [ ] --inject

## 使用

安装： `npm i -D plain-env` 或 `yarn add -D plain-env` 或 `pnpm add -D plain-env`

### CLI

**基础用法：**

`plain-env {config1.yaml}={output-file1.js} {config2.yaml}={output-file2.ts}`

配置文件使用 `yaml`，配置格式参考 [./examples/y-env1.yaml](./examples/y-env1.yaml)

用例：

- `plain-env examples/y-env1.yaml=examples/y-env1.ts`

  自动将 `y-env1.yaml` 转换为 `y-env1.ts`，结果见 [./examples/y-env1.ts](./examples/y-env1.ts)

- `plain-env examples/y-env1.yaml=examples/y-env1.ts examples/y-env1.yaml=examples/y-env1.js`

  多文件支持，自动将 `y-env1.yaml` 转换为 `y-env1.ts`，将 `y-env1.yaml` 转换为 `y-env1.js`，结果见 `examples` 文件夹

- `plain-env examples/y-env1.yaml=examples/y-env1.cjs --module cjs`

  指定 `--module cjs` 将 `y-env1.yaml` 转换为 `CommonJS` 模块系统的 `y-env1.cjs`，结果见 [./examples/y-env1.cjs](./examples/y-env1.cjs)

- `plain-env examples/y-env1.yaml=examples/y-env1.ts --mode dev`

  指定 `--mode dev` 将 `y-env1.yaml` 转换为 `y-env1.ts`，并过滤存在 `dev` 异或 `*` 的子配置。结果见 [./examples/y-env1.ts](./examples/y-env1.ts)

**--mode**

`--mode [mode]`

指定使用的子配置。如果配置项为 Map 且有对应的子字段或者有 `'*'`，则输出对应子字段的值

例如，对于配置

```yaml
ENV_TAG:
  dev: "dev"
  test: "test"
  pro: "pro"
VAR_1:
  "*": 123
  pro: 456
PLAIN: "plain-env"
```

使用 `--mode test` 生成的配置为:

```ts
export const ENV_TAG = "test" as const;
export const VAR_1 = 123 as const;
export const PLAIN = "plain-env" as const;
```

**--inject**

TODO

**--module**

`--module <esm, cjs>`

指定输出的 `TS/JS` 文件的模块系统类型。

- esm: ES Module
- cjs: CommonJS

**--watch**

TODO

**-v**

查看当前版本

**-h**

`plain-env -h`

查看帮助信息

### 导入使用

TODO

## Q&A

**支持的数据类型都有哪些？**

对于 yaml 配置文件，支持：

- `string`
- `number`（正负数、浮点数、NaN、Infinity）
- `boolean`
- `null`
- `Object`
- `Array`

**为什么推荐使用 yaml，而不是 json/.env？**

1. 有更完备的数据类型支持
2. 有更好的数据层级支持

关于 yaml 的使用，更多信息访问这里: https://eemeli.org/yaml/

**构建到不同 mode 时，指定的 output.ts 文件内容总是变化怎么办**

将 `output.ts` 添加到 `.gitignore` 即可
