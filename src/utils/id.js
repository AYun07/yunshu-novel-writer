// 使用crypto.randomUUID()（现代浏览器都支持）
export function generateId() {
  return crypto.randomUUID()
}

export function generateShortId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
