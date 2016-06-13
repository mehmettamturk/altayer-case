(function() {
    /**
     * Empty templates module. This module is used when compiling html
     * views into angular's template cache.
     */
    angular.module('templates', []);


    /**
     * Define our app.
     */
    window.alTayer = angular.module('alTayer', [
        'ui.router',
        'ui-notification',
        'ngSanitize',
        'ngResource',
        'angular-click-outside',
        'templates'
    ]);


    /**
     * Init global settings and run the app.
     */
    alTayer.run(run);


    /**
     * Dependencies of run method.
     * @type {Array}
     */
    run.$inject = [
        '$rootScope',
        '$state',
        'config'
    ];


    /**
     * Run method.
     */
    function run($rootScope, $state, config) {

    };
})();
