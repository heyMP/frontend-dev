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
