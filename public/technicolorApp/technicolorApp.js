/*
*   @author John M. DeIorio <john.m.deiorio@gmail.com>
*/

(function() {

    var app = angular.module('technicolorApp', ["ngRoute","infinite-scroll","technicolorApp-directives"]);



    app.config(function($routeProvider){

    	$routeProvider

    	.when("/",
    		{templateUrl:"views/login.html",
    		controller: "loginController"
    	})
    	.when("/list",
    		{templateUrl:"views/guestBook.html", controller:"guestBookController"
    	})
    	.when("/add",
    		{templateUrl:"views/guestBook_add.html", controller:"guestBookController"
    	})
    	.when("/browse",
    		{templateUrl:"views/browseStates.html", 
    		controller:"browseStatesController"
    	})

    });	




    app.factory("technicolorServices", ["$http","$location",function($http,$location){

    	var service = {};
    	var statesArray = [];
    	var maxStates = 50;
    	var requestLimit = 10;
    	var pageOffset = 0;

    	service.allStatesLoaded = false;
    	service.busy = false;

    	service.userNameDisplay;

    	service.userLog = false;
    	service.navText = "Login";
    	//service.navText = (document.cookie.indexOf("login") >= 0) ? "Logout" : "Login";

    	service.statesObj = [];
    	service.guestBookObj = [];

    	// method to get login status
    	service.getLoginStatus = function(){
    		return service.userLog;
    	}

    	// method to get login display name
    	service.getUserDisplayName = function(){
    		return service.userNameDisplay;
    	}

    	// method used by nav to display correct text based on login status
    	service.getLoginText = function(){
    		return service.navText;
    	}

    	// request logout service
    	service.logout = function() {

        $http.get('http://localhost:8888/logout')

        .success(function(data){

        	console.log("USER LOGGED OUT!!");

        	service.userLog = false;
			service.navText = "Login";
		});

		};

		// request for login service
    	service.login = function(creds) {

    		console.log("LOGIN CREDS OBJ " , creds);
    		//var authObjString = JSON.stringify(creds);

      		$http.post('http://localhost:8888/login', creds)

      		.success(function(data){
      			console.log("Login success!" , data)

      			// set login status true for access to content
				service.userLog = true;
				// change navigation text
				service.navText = "Logout";
				// set user name and capitalize first letter
				service.userNameDisplay = creds.user.charAt(0).toUpperCase() + creds.user.slice(1);

				// reguest data
				service.requestStatesData(requestLimit,pageOffset);
				service.requestGuestBook();
      		})
      		.error(function(data){
      			console.log("Login error!" , data);

      			alert("User not authorized, please try again or contact us for help");

      		});


		};

		// pub method returns the state object data
		service.getStatesObj = function(){
			return service.statesObj;
		};

		// pub method returns the guest book object data
		service.getGuestBookObj = function(){
			
			return service.guestBookObj;

		};

		// request for guest book service endpoint
		service.requestGuestBook = function(){

		console.log("Get guestbook");

        $http.get('http://localhost:8888/read')

        .success(function(data){

		service.guestBookObj = data;

        $location.path("/list");

		})
		.error(function(data){
      		console.log("guest book services error!" , data);
      	});

		};

		// request for states service endpoint
		service.requestStatesData = function(limit,page){

		console.log("Request states service");

		if (service.busy) return;
		service.busy = true;

        $http.get('http://localhost:8888/states',{params:{"limit": limit, "offset": page}})

        .success(function(data){

		data.forEach(function(element) {
    		statesArray.push(element);
		});

		// debug testing only
		// data.forEach(function(value, key) {
		//   console.log("VALUE: " + value + " KEY: " + key);

		//   	for (var p in value) {
  		// 		console.log(p + ": " + value[p]);
		// 		};

		// });

		service.statesObj = statesArray;

		pageOffset = statesArray.length;

		if (maxStates == statesArray.length) service.allStatesLoaded = true;

		console.log("STATES PAGE CHUNK " + pageOffset);

        console.log("STATES FACTORY", service.statesObj);

        service.busy = false;

		})
		.error(function(data){
      		console.log("state services error!" , data);
      	});

		};

		// method to request more states when user scrolls to bottom of list
		service.loadStates = function(){

			// console.log("URI PATH" , $location);
			// console.log("URI PATH" + $location.$$path);

			// we should only request data when on browse page itself and if user is logged in
			if (($location.$$path == "/browse")&&(service.userLog)){

				// insure we haven't loaded all states yet
				if (pageOffset < maxStates) {
					console.log("GET MORE STATES");
					this.requestStatesData(requestLimit,pageOffset);
				}

			}
    	};

    	// method to add guest message to database
		service.addNewGuest = function(newGuest) {
			

			$http.post('http://localhost:8888/write', newGuest)

      		.success(function(data){
      			console.log("added message success!" , data)

				service.guestBookObj = data;

				//session data
				//sessionStorage.guestBookObj = JSON.stringify(data);

      			$location.path("/list");
				//service.getGuestBook();
      		})
      		.error(function(data){
      			console.log("write error!" , data)
      		});

		};


    	return service;

        }]);

		// global page level controller for modal and infinite scroll operations
		app.controller('globalController',['technicolorServices','$scope',function(technicolorServices,$scope){

			  $scope.selectedState = {};

			  $scope.isBusy = function() {
			  		return technicolorServices.busy;
			   };

			  $scope.loadMore = function() {
			  		//console.log("LOAD MORE GLOBAL CONTROLLER");
			  		technicolorServices.loadStates();
			   };

			  $scope.viewStateDetails = function(obj){

					console.log("selected obj" , obj);

					$scope.selectedState = obj;

					//console.log("most-populous-city" + $scope.selectedState.most-populous-city);
					

			  };


		}]);

})();

