// Minimal stub to bypass source-map parsing in Cypress bundles.
class SourceMapConsumer {
  constructor() {}
  static with(_map, _nullish, cb) {
    return typeof cb === 'function' ? cb(null) : undefined;
  }
  originalPositionFor() {
    return {};
  }
  destroy() {}
}

module.exports = {
  SourceMapConsumer,
};
