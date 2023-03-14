/**
 * 获取 JS 数据类型 返回大写字母开头
 * @param data
 * @returns {string} Function | Array | String | Number | Undefined | Null ...
 */
export const getType = (data: any): string => {
  return Object.prototype.toString.call(data).slice(0, -1)
}

/**
 * 前置 0
 * @param str 原始字符串
 * @param count 补充数量
 * @returns string
 */
export const addPreZero = (str: string, count: number): string => {
  return (new Array(count).fill(0).join() + str).slice(-2)
}

/**
 * 获取一串不会重复的字符（UUID）
 * @returns uuid {string}
 */
export const getUuid = () => {
  return Number(Math.random().toString().substr(2, 5) + Date.now()).toString(36)
}
