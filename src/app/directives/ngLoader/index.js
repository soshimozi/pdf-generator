const ngLoader = function ($rootScope) {
    return {
        restrict: 'AE',
        transclude: true,
        scope: true,
        template: require('../../views/partials/ajax-loader'),
        link: function(scope, element, attrs) {
            scope.show = false;

            scope.$on("loader_show", function () {
            scope.show = true;
            });

            scope.$on("loader_hide", function () {
                scope.show = false;
            });
        }
    };        
};

ngLoader.$inject = ['$rootScope'];
module.exports = ngLoader;