export interface DynatraceWindow extends Window {
  dtrum?: {
    enable: () => void;
    isEnabled: () => boolean;
  };
}

export function loadDynatraceScript(document: Document, browserWindow: DynatraceWindow): void {
  const scriptUrl = document.querySelector('meta[name="dynatrace-script-url"]')?.getAttribute('content');

  if (!scriptUrl) {
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  script.crossOrigin = 'anonymous';
  script.addEventListener('load', () => {
    if (browserWindow.dtrum && !browserWindow.dtrum.isEnabled()) {
      browserWindow.dtrum.enable();
    }
  });
  document.head.appendChild(script);
}
