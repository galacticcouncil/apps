export function pairs2Map<T>(pairs: [string, T][]): Map<string, T> {
  const result = new Map<string, T>();
  pairs.forEach((pair: [string, T]) => result.set(pair[0], pair[1]));
  return result;
}
