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
        // url will be nested (/wizard/profile)
        .state('wizard.profile', {
            url: '/profile',
            template: require('../templates/forms/wizard-profile')
        })

        // url will be /wizard/editor
        .state('wizard.editor', {
            url: '/editor',
            template: require('../templates/forms/wizard-editor')
        })

        // url will be /wizard/download
        .state('wizard.download', {
            url: '/download',
            template: require('../templates/forms/wizard-download')
        })

        // url will be /form/payment
        .state('wizard.title', {
            url: '/title',
            template: require('../templates/forms/wizard-title')
        });
        

    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/wizard/profile');
}

module.exports = stateFunction;