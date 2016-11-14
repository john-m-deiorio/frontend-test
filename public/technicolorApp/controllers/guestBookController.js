(function() {

    angular
        .module('technicolorApp')

        .controller("guestBookController", ["$scope","$log","technicolorServices","$location",

    	function($scope,$log,technicolorServices,$location) {

    	// bind guestbook
    	$scope.guestBookData = technicolorServices.getGuestBookObj();

    	// personalize welcome
    	$scope.displayName = technicolorServices.getUserDisplayName();

		console.log("guestBookController", $scope.guestBookData);

		$scope.guestBookFormModel = {};

    	// used to show hide data in view
		$scope.userLoggedIn = technicolorServices.getLoginStatus();

		console.log("IS USER LOGGED IN?????" + $scope.userLoggedIn);
		console.log("guestbook?????" , $scope.guestBookData);

		$scope.submitLoginCreds = function(){

			technicolorServices.login();
		}

		$scope.addGuest = function(){
			$location.path("/add");
		}

	 	$scope.save = function(){

	 			console.log("GUEST BOOK OBJ" , $scope.guestBookFormModel);

	 			technicolorServices.addNewGuest($scope.guestBookFormModel);
		}


		$scope.cancel = function(){
			$location.path("/list");
		}


    }]);

})();