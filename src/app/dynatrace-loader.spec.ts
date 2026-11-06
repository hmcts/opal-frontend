import { loadDynatraceScript, type DynatraceWindow } from './dynatrace-loader';

describe('Dynatrace loader', () => {
  afterEach(() => {
    document.head.querySelector('meta[name="dynatrace-script-url"]')?.remove();
    document.head.querySelectorAll('script').forEach((script) => script.remove());
    delete (window as DynatraceWindow).dtrum;
  });

  it('loads and enables Dynatrace when a script URL is configured', () => {
    const scriptUrl = 'https://example.com/dynatrace.js';
    const meta = document.createElement('meta');
    meta.name = 'dynatrace-script-url';
    meta.content = scriptUrl;
    document.head.appendChild(meta);

    const enable = vi.fn();
    const isEnabled = vi.fn().mockReturnValue(false);
    (window as DynatraceWindow).dtrum = { enable, isEnabled };

    loadDynatraceScript(document, window as DynatraceWindow);

    const script = document.head.querySelector('script');
    expect(script?.src).toBe(scriptUrl);
    expect(script?.crossOrigin).toBe('anonymous');
    expect(enable).not.toHaveBeenCalled();

    script?.dispatchEvent(new Event('load'));

    expect(isEnabled).toHaveBeenCalledOnce();
    expect(enable).toHaveBeenCalledOnce();
  });

  it('does not enable Dynatrace again when it is already enabled', () => {
    const meta = document.createElement('meta');
    meta.name = 'dynatrace-script-url';
    meta.content = 'https://example.com/dynatrace.js';
    document.head.appendChild(meta);

    const enable = vi.fn();
    (window as DynatraceWindow).dtrum = { enable, isEnabled: vi.fn().mockReturnValue(true) };

    loadDynatraceScript(document, window as DynatraceWindow);
    document.head.querySelector('script')?.dispatchEvent(new Event('load'));

    expect(enable).not.toHaveBeenCalled();
  });

  it('does not add or enable the script when no URL is configured', () => {
    const enable = vi.fn();
    (window as DynatraceWindow).dtrum = { enable, isEnabled: vi.fn().mockReturnValue(false) };

    loadDynatraceScript(document, window as DynatraceWindow);

    expect(document.head.querySelector('script')).toBeNull();
    expect(enable).not.toHaveBeenCalled();
  });
});
