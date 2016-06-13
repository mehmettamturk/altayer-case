(function() {
    /**
     * Routing configuration.
     */
    alTayer.config(routes);


    /**
     * Dependencies.
     * @type {Array}
     */
    routes.$inject = [
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];


    /**
     * Routes.
     */
    function routes($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('homepage', {
                url: '/',
                templateUrl: './components/homepage/view.html',
                data: {pageTitle: 'Mamas & Papas'},
                controller: 'HomepageController'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    };
})();
