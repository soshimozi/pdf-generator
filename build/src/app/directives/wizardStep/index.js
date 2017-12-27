module.exports = function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            wzTitle: '@',
            wzHeadingTitle: '@',
            canenter : '=',
            canexit : '=',
            disabled: '@?wzDisabled',
            description: '@',
            wzData: '=',
            wzOrder: '@?'
        },
        require: '^wizard',
        template: require('../../templates/wizardStep'),
        link: function ($scope, $element, $attrs, wizard) {
            $attrs.$observe('wzTitle', function (value) {
                $scope.title = $scope.wzTitle;
            });
            $scope.title = $scope.wzTitle;
            wizard.addStep($scope);
            $scope.$on('$destroy', function(){
                wizard.removeStep($scope);
            });
        }
    };
};