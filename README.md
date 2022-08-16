# ts-env

Auto generate ts/js file from config file and env

## 特性

- 简单易用
- 完全自定义
- 多文件类型支持
- 框架无关
- 安全
- 字段缺省检查
- 保留注释

## 使用

安装： `npm i -D ts-env` 或 `yarn add -D ts-env` 或 `pnpm add -D ts-env`

1. 转换配置文件

   `ts-env build {input-file}={output-file}`

2. 指定环境

   `ts-env build --mode {标识1} --mode {标识2}`

   假如你的产品对应了 `dev`、`test`、`pre`、`prod` 4 套环境 + `oss-hangzhou`、`oss-shanghai` 2 个特异化配置，则可以通过 `ts-env dev oss-hangzhou` 自动处理环境配置

3. 加载配置文件

   `--dir ['./config', './config1']`

   例如指定配置为 `prod`，则会自动按照以下优先级寻找 `./config` 和 `./config1` 文件夹里的对应配置文件，找到为止：

   - prod.yaml
   - prod.json
   - .env.prod

4. 使用环境变量

   `SPECIAL_FOR_THIS_PROJECT=${SPECIAL_FOR_THIS_PROJECT}`

5. 指定接收值

   `ts-env --inject NODE_ENV=1 --inject ENV=2`

## 最佳实践

请参考 examples

### 推荐使用 yaml 而不是 json/.env

more info: https://eemeli.org/yaml/

1. 有更好的数据类型支持

2. 有更好的数据层级支持
