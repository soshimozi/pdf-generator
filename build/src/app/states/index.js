const stateFunction = function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('wizard', {
            url: '/wizard',
            template: require('../templates/forms/wizard-form'),
            controller: 'WizardController',
            controllerAs: 'vm'
        })

        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('wizard.profile', {
            url: '/profile',
            template: require('../templates/forms/wizard-profile')
        })

        // url will be /form/interests
        .state('wizard.editor', {
            url: '/editor',
            template: require('../templates/forms/wizard-editor')
        })

        // url will be /form/payment
        .state('wizard.download', {
            url: '/download',
            template: require('../templates/forms/wizard-download')
        });

    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/wizard/profile');
}

module.exports = stateFunction;