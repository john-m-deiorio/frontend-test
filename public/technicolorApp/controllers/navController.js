(function() {

    angular
        .module('technicolorApp')

	    .controller("navController", ["$scope","$log","technicolorServices","$location",
			function ($scope, $log, technicolorServices, $location) 
			{ 

				console.log("NAV CONTROLLER");

				$scope.doLogout = function(){
					if (technicolorServices.getLoginStatus()) {
						console.log("DO LOGOUT");
						
						technicolorServices.logout();
					}
				}
				$scope.getStatusText = function(){
					return technicolorServices.getLoginText();
				}

			    $scope.isActive = function (viewLocations) {

			    	var active = false;

			    	var currentLocation = $location.path();

			    	// set the active state for the nav bar
			    	for (var i=0; i<viewLocations.length; i++){

			    		// slice off any suffixes for sub views since they may contain indexes
			    		if (currentLocation.length > 1 && currentLocation.lastIndexOf("/")>1) {
							currentLocation = currentLocation.slice(0,currentLocation.lastIndexOf("/"));

			    		}
			    		// if location matches nav item return true
			    		if (viewLocations[i] === currentLocation) {
			    			active = true;
			    		}
		
			    	}

			        return active;
			    }
			}
		]);

})();