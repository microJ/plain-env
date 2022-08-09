# ts-env

auto generate ts file from config or env

## 特性

- 简单易用
- 完全自定义
- 多文件类型支持
- 框架无关
- 安全
- 字段缺省检查

## 概念

1. 指定环境

   - `ts-env {环境}`
     假如你的产品对应了 `dev`、`test`、`pre`、`prod` 4 套环境，则可以通过 `ts-env dev` 自动处理环境配置

2. 加载配置文件

   - `['./config', './config1']`
     例如指定环境为 `prod`，则会自动按照以下优先级寻找 `./config` 和 `./config1` 文件夹里的对应配置文件，找到为止：
     - prod.yaml
     - prod.json
     - .env.prod

3. 加载环境变量

   - `['process.env.NODE_ENV', 'process.env.UPLOAD_TO_OSS', 'process.env.SPECIAL_FOR_THIS_PROJECT']`

## 最佳实践

请参考 examples

### 推荐使用 yaml/json 而不是 .rc/.env

`yaml`/`json` 更好的支持数据层级和类型
