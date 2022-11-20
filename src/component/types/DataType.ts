export class DataType {
  static isValid(value: any): boolean {
    return false;
  }

  static getMap(types: Record<string, string>): Map<string, string> {
    const map = new Map<string, string>();
    Object.keys(types).forEach((type) => {
      map.set(type, types[type]);
    });
    return map;
  }
}
