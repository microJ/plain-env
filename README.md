# plain-env

[![npm](https://img.shields.io/npm/v/plain-env?label=plain-env)](https://www.npmjs.com/package/plain-env)
![npm type definitions](https://img.shields.io/npm/types/typescript)
![module system](https://img.shields.io/badge/Module%20System-CommonJS%20%26%20ES--Module-green)
![file support](https://img.shields.io/badge/file-yaml-green)

Replacement for `.env` and `Webpack.DefinePlugin`. Framework agnostic. Auto generate TS/JS file from config file and `process.env`, and auto pick sub-config for the target runtime/deploy environment. Support CLI & Node.js.

`.env` 和 `Webpack.DefinePlugin` 的替代品。该工具与框架无关。
自动从环境配置文件和 `process.env` 创建 TS/JS 配置导出文件，支持自动选择对应部署环境的子配置。支持命令行和 Node.js。

## 特性

- 简单、灵活、易用
- 框架无关
- 支持命令行 `plain-env ...`
- 自动注入系统环境变量 process.env.xx / --inject
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
