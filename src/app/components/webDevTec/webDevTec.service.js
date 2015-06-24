(function() {
  'use strict';

  angular
      .module('switchMqtt')
      .service('webDevTec', webDevTec);

  /** @ngInject */
  function webDevTec() {
    var data = [
     
    ];

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }

})();
