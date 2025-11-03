const globalPromises: Record<string, Promise<any>> = {}

export function globalPromise<T>(name: string, promise: () => Promise<T>): Promise<T> {
  const lastPromise = globalPromises[name] ?? Promise.resolve()
  const nextPromise = lastPromise.then(() => promise())
  globalPromises[name] = nextPromise.catch(() => {})
  return nextPromise
}
