(function() {
    'use strict';


    /**
     * Angular definition.
     */
    alTayer.controller('HomepageController', HomepageController);


    /**
     * Dependencies.
     */
    HomepageController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        'config'
    ];


    /**
     * Dashboard controller.
     */
    function HomepageController($rootScope, $scope, $stateParams, config) {

        $scope.$on('$viewContentLoaded', function(){
            $('.carousel').carousel({
                interval: 5000
            });
        });
    };
})();
