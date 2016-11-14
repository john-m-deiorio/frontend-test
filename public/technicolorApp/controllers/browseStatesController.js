(function() {

    angular
        .module('technicolorApp')

        .controller("browseStatesController", ["$scope","$log","technicolorServices",

    	function($scope,$log,technicolorServices) {

    	// used to show hide data in view
		$scope.userLoggedIn = technicolorServices.getLoginStatus();

		$scope.data = technicolorServices.getStatesObj();

		console.log("browseStatesController", $scope.data);

		// set the default sort
    	$scope.sortOrderBy = "name";
    	$scope.direction = false;// ascending

		$scope.setSortOrder = function(orderBy,sortDirection){

			console.log("ORDER BY: " + orderBy);

			$scope.sortOrderBy = orderBy;
			$scope.direction = sortDirection;
		};


    }]);

})();