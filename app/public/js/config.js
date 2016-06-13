(function() {
    /**
     * Environment configuration
     */
    alTayer.constant('config', {
        'SITE': '__SITE_URL__',
        'API_URL': '__API_URL__',
        'meta': {
            'title': 'AlTayer',
            'description': '',
            'keywords': '',
            'share': {
                'title': 'AlTayer',
                'image': '/img/logo.png',
                'site': '/',
                'description': ''
            }
        }
    });

    /**
     * Configure.
     */
    alTayer.config(configure);


    /**
     * Dependencies.
     * @type {Array}
     */
    configure.$inject = ['$httpProvider', 'NotificationProvider', '$animateProvider', '$provide'];


    /**
     * Main configure method.
     */
    function configure($httpProvider, NotificationProvider, $animateProvider, $provide) {
        $animateProvider.classNameFilter(/animated/);
        $httpProvider.defaults.withCredentials = true;

        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 10,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    };
})();
