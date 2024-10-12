export function randomString(size = 4) {
  return [...Array(size)].map(() => Math.random().toString(36)[2]).join("");
}
