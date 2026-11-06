(function loadDynatraceScript() {
  var scriptUrl = document.querySelector('meta[name="dynatrace-script-url"]')?.getAttribute('content');

  if (!scriptUrl) {
    return;
  }

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  script.crossOrigin = 'anonymous';
  script.addEventListener('load', function enableDynatrace() {
    if (window.dtrum && !window.dtrum.isEnabled()) {
      window.dtrum.enable();
    }
  });
  document.head.appendChild(script);
})();
