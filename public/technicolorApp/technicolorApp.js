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

    	// initialize session storage display var
    	// if (sessionStorage.userNameDisplay) sessionStorage.removeItem("userNameDisplay");

    	service.userLog = false;
    	service.navText = "Login";
    	//service.navText = (document.cookie.indexOf("login") >= 0) ? "Logout" : "Login";

    	service.statesObj = [];
    	service.guestBookObj = [];

    	service.getLoginStatus = function(){

    		return service.userLog;
    		//return (document.cookie.indexOf("login") >= 0) ? true : false;

    	}

    	service.getUserDisplayName = function(){

    		//if (sessionStorage.userNameDisplay) return sessionStorage.userNameDisplay;
    		return service.userNameDisplay;
    	}

    	service.getLoginText = function(){
    		return service.navText;
    	}

    	service.logout = function() {

        $http.get('http://localhost:8888/logout')

        .success(function(data){

        	console.log("USER LOGGED OUT!!");

			//sessionStorage.removeItem("userNameDisplay");

        	service.userLog = false;
			service.navText = "Login";
		});

		};

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

				//if(!sessionStorage.userNameDisplay) sessionStorage.userNameDisplay = service.userNameDisplay;

				//console.log("welcome: " , service.userNameDisplay);

				//console.log("COOKIE: ", document.cookie);
				//console.log("COOKIE login: " , document.cookie.indexOf("login"));


				// reguest data
				service.requestStatesData(requestLimit,pageOffset);
				service.requestGuestBook();
      		})
      		.error(function(data){
      			console.log("Login error!" , data);

      			alert("User not authorized, please try again or contact us for help");
      			//console.log("COOKIE: ", document.cookie);
      			//console.log("COOKIE login: " , document.cookie.indexOf("login"));

      		});


		};

		service.getStatesObj = function(){
			return service.statesObj;
		};

		service.getGuestBookObj = function(){
			
			return service.guestBookObj;

			// session storage
			//if(sessionStorage.guestBookObj) return JSON.parse(sessionStorage.guestBookObj);
		};


		service.requestGuestBook = function(){

		console.log("Get guestbook");

        $http.get('http://localhost:8888/read')

        .success(function(data){

		service.guestBookObj = data;
		// session storage
		//if(!sessionStorage.guestBookObj) sessionStorage.guestBookObj = JSON.stringify(data);

        $location.path("/list");

		});

		};


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

		});

		};

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

