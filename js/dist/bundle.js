(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var viewportUnitsRepaint = require('./viewportUnitsRepaint.js');

(function ($) {
  'use strict';

  objectFit.polyfill({
      selector: 'img', // this can be any CSS selector
      fittype: 'cover', // either contain, cover, fill or none
      disableCrossDomain: 'true' // either 'true' or 'false' to not parse external CSS files.
  });

  // MenuToggle
  if (typeof Drupal != 'undefined') {
    Drupal.behaviors.repaintSlickbanner = {
      attach: function (context, settings) {
        viewportUnitsRepaint($('.slickheader__title'));
      }
    };
  }
  else {
    $(document).ready(function() {
      viewportUnitsRepaint($('.slickheader__title'));
    });
  }

})(jQuery);

},{"./viewportUnitsRepaint.js":2}],2:[function(require,module,exports){
module.exports = function(target) {
  'use strict';

  $(window).resize(function () {
    target.css('z-index', "1");
  });
};

},{}]},{},[1]);
