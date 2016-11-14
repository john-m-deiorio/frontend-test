(function() {
    var app = angular.module('technicolorApp-directives',[]);

    app.directive("guestList", function() {
        return {
            restrict: 'E',
            templateUrl: "partials/guest-list.html"
        };
    });

    app.directive("browseStateDetailView", function() {
        return {
            restrict: 'E',
            templateUrl: "views/browse-state-detail-view.html"
        };
    });

})();
