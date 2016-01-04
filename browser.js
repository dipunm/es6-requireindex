var camelcase = require('camelcase');
var util = require('./util');

module.exports = function requireFromWebpackContext(ctx, opts) {
  opts = util.withDefaults(opts);

  var mods = {};

  ctx.keys().forEach(function(filename) {
    var mod = ctx(filename);

    // Check if the exported object has a es6-styled default export
    if (opts.requireES6Defaults) {
      mod = util.getExport(mod);
    }

    var filepath = filename.replace('./', '');
    setIn(mod, mods, filepath, opts.recursive);
  });

  return mods;
};

function setIn(mod, mods, filename, recursive) {
  var parts = filename.split('/');
  var isDirPart = parts.length > 1;
  var modName;

  if (isDirPart && recursive) {
    modName = parts[0];
    mods[modName] = mods[modName] || {};
    setIn(mod, mods[modName], parts.slice(1).join('/'));
  } else if (!isDirPart) {
    modName = parts[parts.length - 1];
    modName = camelcase(modName.substr(0, modName.indexOf('.')));
    mods[modName] = mod;
  }
}
