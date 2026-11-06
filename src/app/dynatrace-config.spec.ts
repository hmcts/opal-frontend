import { addDynatraceScriptUrl } from './dynatrace-config';

describe('addDynatraceScriptUrl', () => {
  const document = '<head><meta name="dynatrace-script-url" content></head>';

  it('adds the configured URL to the document', () => {
    const configuredDocument = addDynatraceScriptUrl(document, 'https://example.com/script.js?a=1&b=2');

    expect(configuredDocument).toContain(
      '<meta name="dynatrace-script-url" content="https://example.com/script.js?a=1&amp;b=2" />',
    );
  });

  it('leaves the document unchanged when no URL is configured', () => {
    expect(addDynatraceScriptUrl(document, '')).toBe(document);
  });
});
