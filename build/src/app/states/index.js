const stateFunction = function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            template: require('../templates/forms/main-form'),
            controller: 'formController',
            controllerAs: 'vm'
        })

        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            template: require('../templates/forms/form-profile')
        })

        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            template: require('../templates/forms/form-interests')
        })

        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            template: require('../templates/forms/form-payment')
        });

    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/profile');
}

module.exports = stateFunction;