/**
 *  class RubySassEngine
 *
 *  Engine for the SASS/SCSS compiler. You will need `sass` Ruby gem installed
 *  in order to use [[Mincer]] with `*.sass` or `*.scss` files:
 *
 *      gem install sass
 *
 *
 *  ##### SUBCLASS OF
 *
 *  [[Template]]
 **/


'use strict';

var Mincer      = require('mincer');
var Template    = Mincer.Template;
var prop        = require('mincer/lib/mincer/common').prop;
var path        = require('path');
var shellescape = require('shell-escape');
var sh = require('execSync');

////////////////////////////////////////////////////////////////////////////////

// Class constructor
var RubySassEngine = module.exports = function RubySassEngine() {
  Template.apply(this, arguments);
};

require('util').inherits(RubySassEngine, Template);

// Render data
RubySassEngine.prototype.evaluate = function (context, locals) {
  var data = this.data.replace(/[\$\(\)\[\]\\"]/g, '\\$&'),
      dir = path.dirname(this.file),
      css = sh.exec('echo "' + data + '" | sass -s -q --scss -I ' + shellescape([dir]));

  if (css.code) {
    throw new Error(css.stdout);
  } else {
    return css.stdout;
  }
};


// Expose default MimeType of an engine
prop(RubySassEngine, 'defaultMimeType', 'text/css');