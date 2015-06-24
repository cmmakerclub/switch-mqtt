(function() {
  'use strict';

  angular
    .module('switchMqtt')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
