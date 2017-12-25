/*
function _skipIfAuthenticated ($q) {
    let defer = $q.defer();
    let token = localStorage.getItem('auth-token');
    if(!token) {
        defer.reject(); // (1)
    } else {
        defer.resolve(); // (2)
    }
    return defer.promise;
}

function _redirectIfNotAuthenticated ($q, $location, $timeout) {
    let defer = $q.defer();
    let token = localStorage.getItem('auth-token');
    if(!token) {
        defer.resolve();
    } else {
        $timeout(function() {
            $location.url('signin');
        });
    }
}
*/

const routes = function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            template: require('../templates/main'),
            controller: 'MainController as vm'
            // resolve: {
            //     redirectIfNotAuthenticated : _redirectIfNotAuthenticated
            // }
        })

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(() => {
        return {
            request: (config) => {
                let token = localStorage.getItem("auth-token");
                if (token) {
                    config.headers["Authorization"] = "Bearer " + token;
                }

                return config;
            },


            responseError: () => {
                // do something with error
            }
        }
    })
};

module.exports = routes;