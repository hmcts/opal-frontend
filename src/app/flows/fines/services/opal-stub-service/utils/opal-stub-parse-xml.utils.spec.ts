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

  it('should return XML input when parsing fails', () => {
    const xml = '<response><count>1</count></response>';

    const originalParseFromString = DOMParser.prototype.parseFromString;
    DOMParser.prototype.parseFromString = () => {
      const parserErrorDoc = document.implementation.createDocument('', '', null);
      const parserError = parserErrorDoc.createElement('parsererror');
      parserErrorDoc.appendChild(parserError);
      return parserErrorDoc;
    };

    const result = parseXmlToJson(xml);

    expect(result).toBe(xml);

    DOMParser.prototype.parseFromString = originalParseFromString;
  });

  it('should return an empty string when element has no text content', () => {
    const xml = '<response><empty></empty></response>';

    const result = parseXmlToJson(xml);

    expect(result).toEqual({ response: { empty: '' } });
  });

  it('should fall back to an empty string when textContent is null', () => {
    const xml = '<response></response>';

    const originalParseFromString = DOMParser.prototype.parseFromString;
    DOMParser.prototype.parseFromString = () => {
      const doc = document.implementation.createDocument('', 'response', null);
      const root = doc.documentElement;
      Object.defineProperty(root, 'textContent', { get: () => null });
      return doc;
    };

    const result = parseXmlToJson(xml);

    expect(result).toEqual({ response: '' });

    DOMParser.prototype.parseFromString = originalParseFromString;
  });

  it('should store duplicate tags as arrays when values already exist', () => {
    const xml = '<response><item>1</item><item>2</item><item>3</item></response>';

    const result = parseXmlToJson(xml);

    expect(result).toEqual({ response: { item: ['1', '2', '3'] } });
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
