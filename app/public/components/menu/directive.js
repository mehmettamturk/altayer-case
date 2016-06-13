(function() {
    'use strict';


    /**
     * Angular definition.
     */
    alTayer.directive('menu', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "./components/menu/view.html",
            controller: Menu
        }
    });


    /**
     * Dependencies.
     */
    Menu.$inject = [
        '$rootScope',
        '$scope',
        'SearchService'
    ];


    /**
     * Menu Directive.
     */
    function Menu($rootScope, $scope, SearchService) {
        $scope.searchKey = '';

        $scope.searchLoading = false;
        $scope.showSearchResult = false;
        $scope.searchResult = [];

        $scope.hideResultBox = function() {
            $scope.showSearchResult = false;
        };

        $scope.search = function() {
            if ($scope.searchKey && $scope.searchKey.length > 2) {
                $scope.showSearchResult = true;
                $scope.searchLoading = true;

                SearchService.search($scope.searchKey, function(data) {
                    console.log(data)

                    $scope.searchResult = data;
                    $scope.searchLoading = false;
                })
            }
        }
    }
})();
