import { IOpalStubParsedXml } from './interfaces/opal-stub-parse-xml.interface';

export const parseXmlToJson = (xml: string): IOpalStubParsedXml | string => {
  if (typeof DOMParser === 'undefined') {
    return xml;
  }

  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0 || !doc.documentElement) {
    return xml;
  }

  const root = doc.documentElement;
  return { [root.tagName]: parseXmlElement(root) };
};

const parseXmlElement = (element: Element): unknown => {
  const children = Array.from(element.children);
  if (children.length === 0) {
    return element.textContent?.trim() ?? '';
  }

  const result: Record<string, unknown> = {};

  for (const child of children) {
    const value = parseXmlElement(child);
    const existing = result[child.tagName];
    if (existing === undefined) {
      result[child.tagName] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      result[child.tagName] = [existing, value];
    }
  }

  return result;
};
