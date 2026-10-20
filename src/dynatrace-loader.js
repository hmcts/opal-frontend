(function loadDynatraceScript() {
  var scriptUrl = document.querySelector('meta[name="dynatrace-script-url"]')?.getAttribute('content');

  if (!scriptUrl) {
    return;
  }

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
})();
