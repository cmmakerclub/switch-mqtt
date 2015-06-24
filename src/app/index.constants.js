/* global malarkey:false, toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('switchMqtt')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment);

})();
