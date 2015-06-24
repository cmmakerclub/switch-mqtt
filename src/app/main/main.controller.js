(function() {
  'use strict';

  angular
    .module('switchMqtt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, webDevTec, toastr) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1435123596915;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }

    $scope.heartbeat = "WAITING...";

    var host = '128.199.104.122'; // hostname or IP address
    var port = 9001;
    var useTLS = false;
    var username = null;
    var password = null;
    var cleansession = true;
    // username = "jjolie";
    // password = "aa";
    var topic_list = ["esp8266/18:fe:34:fe:c0:ff/#"];

    var mqtt;
    var reconnectTimeout = 2000;
    function MQTTconnect() {
        mqtt = new Paho.MQTT.Client(
                        host,
                        port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            onFailure: function (message) {
                console.log("failed");
                setTimeout(MQTTconnect, reconnectTimeout);
            }
        };
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(options);
    }
    function onConnect() {
        console.log('Connected to ' + host + ':' + port);
        angular.forEach(topic_list, function(topic, idx) {
          console.log("subscribing..", topic);
          mqtt.subscribe(topic, {qos: 0});
        });
    }
    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);
        console.log("connection lost: " + response.errorMessage + ". Reconnecting");
    };


    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        var json = JSON.parse(payload);
        
        if (topic.indexOf("/command") !== false) {
          if (payload == "0") {
            $scope.enabled = false;
          }
          else if (payload == "1") {
            $scope.enabled = true;
          }
          $scope.$apply();
        }

        if (json.d && json.d.myName == "TONG")  {
          $scope.heartbeat = json.d;
          $scope.$apply();
          console.log(json.d && json.d.myName);
        }

    };

    MQTTconnect();
    $scope.enable = function(state) {
      var qos = 0;
      var retain = true;
      if (state) {
        mqtt.send("esp8266/18:fe:34:fe:c0:ff/command", "1", qos, retain)
      }
      else {
        mqtt.send("esp8266/18:fe:34:fe:c0:ff/command", "0", qos, retain);
      }
    }


  }
})();
