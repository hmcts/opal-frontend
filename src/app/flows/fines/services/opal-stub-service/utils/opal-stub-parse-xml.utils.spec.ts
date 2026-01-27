import { parseXmlToJson } from './opal-stub-parse-xml.utils';

describe('parseXmlToJson', () => {
  it('should parse simple XML into a JSON object', () => {
    const xml = '<response><count>1</count></response>';

    const result = parseXmlToJson(xml);

    expect(result).toEqual({ response: { count: '1' } });
  });

  it('should preserve duplicate tags as arrays', () => {
    const xml = '<response><item>1</item><item>2</item></response>';

    const result = parseXmlToJson(xml);

    expect(result).toEqual({ response: { item: ['1', '2'] } });
  });

  it('should return XML input when DOMParser is unavailable', () => {
    const original = globalThis.DOMParser;
    const xml = '<response><count>1</count></response>';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMParser = undefined;
    const result = parseXmlToJson(xml);

    expect(result).toBe(xml);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMParser = original;
  });
});
