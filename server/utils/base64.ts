export function encode<T>(dataToEncode: T): string {
  return Buffer.from(JSON.stringify(dataToEncode)).toString('base64');
}

export function decodeObject<T>(base64string: string): T {
  return JSON.parse(Buffer.from(base64string, 'base64').toString());
}
