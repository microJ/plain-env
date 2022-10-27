import { Module, TargetType } from '../type.t'

/**
 * handle extra config
 * @param config
 * @param module
 * @param targetType
 * @returns
 */
export function resolveConfig(
  config: Record<string, any>,
  module: Module,
  targetType: TargetType
) {
  return Object.entries(config).reduce(
    (acc, v) => acc + joinKeyValue(v[0], v[1], module, targetType),
    ''
  )
}

function joinKeyValue(
  key: string,
  value: unknown,
  module: Module,
  targetType: TargetType
) {
  const langExportLeft =
    module === 'cjs' ? `exports.${key}` : `export const ${key}`
  const isClearJSType =
    [undefined, null, Infinity, -Infinity].some((v) => v === value) ||
    Number.isNaN(value)
  const expressionRightEnd =
    targetType === 'js' ? '' : isClearJSType ? '' : ' as const'

  return `\n${langExportLeft} = ${JSON.stringify(value)}${expressionRightEnd}`
}
