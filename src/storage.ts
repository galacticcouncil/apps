const ls = window.localStorage;

export function setItem(key: string, val: string) {
  ls.setItem(key, val);
}

export function setObj(key: string, object: any) {
  const json = JSON.stringify(object);
  ls.setItem(key, json);
}

export function getItem(key: string): string {
  return ls.getItem(key);
}

export function getObj<T>(key: string): T {
  const item = ls.getItem(key);
  return JSON.parse(item) as T;
}
