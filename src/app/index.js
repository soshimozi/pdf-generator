const angular = require('angular');

require('angular-route');
require('angular-ui-bootstrap');
require('jquery/dist/jquery');
require('ngclipboard');

import '../../node_modules/bootstrap/dist/css/bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme';
import '../../node_modules/font-awesome/css/font-awesome.css';
import './styles/app.css';

const app = angular.module('test-pdf-generation-app', [
    'ngRoute',
    'ui.bootstrap',
    'ngclipboard'
]);

import MainController from './controllers/main-controller';

app.controller('MainController', MainController);

app.config(require('./routes'));

app.factory('httpInterceptor', require('./factories/httpInterceptor'));
app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
});

app.provider('ngQuillConfig', require('./providers/ngQuillConfig'));

app.config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
    ngQuillConfigProvider.set(null, null, 'custom placeholder')
}])

app.directive("ngLoader", require('./directives/ngLoader'));
app.component('ngQuillEditor', require('./components/ngQuilleditor')());
