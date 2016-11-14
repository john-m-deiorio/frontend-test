(function() {

    angular
        .module('technicolorApp')

        .controller("loginController", ["$scope","technicolorServices",

    	function($scope,technicolorServices) {

		$scope.loginFormModel = {};

		$scope.submitLoginCreds = function(){

			technicolorServices.login($scope.loginFormModel);

		};


    }]);

})();