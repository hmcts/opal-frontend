export function addDynatraceScriptUrl(document: string, scriptUrl: string): string {
  if (!scriptUrl) {
    return document;
  }

  const escapedScriptUrl = scriptUrl.replace(/[&<>"']/g, (character) => {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return htmlEscapes[character] ?? character;
  });

  return document.replace(
    /<meta name="dynatrace-script-url"[^>]*>/,
    `<meta name="dynatrace-script-url" content="${escapedScriptUrl}" />`,
  );
}
