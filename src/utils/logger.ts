export function logger(tag: string, ...msg: any[]) {
  //@ts-ignore
  if (process.env.NODE_ENV !== "production" || window?.sageDebug) {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`[${tag}]: `, ...msg);
  }
}
