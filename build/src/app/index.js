const angular = require('angular');

require('angular-ui-bootstrap');
require('jquery/dist/jquery');
require('ngclipboard');
require('angular-animate');
require('angular-formly');
require('angular-formly-templates-bootstrap');

import '../../node_modules/font-awesome/css/font-awesome.css';
import './styles/app.css';
import './styles/pdf-styles.css';
import './styles/wizard-steps.css';
import './styles/angular-wizard.less';

import uiRouter from "@uirouter/angularjs";

const app = angular.module('test-pdf-generation-app', [
    // 'ngRoute',
    'ui.bootstrap',
    'ngclipboard',
    'formly',
    'formlyBootstrap',
    'ngAnimate',
    uiRouter
]);

import MainController from './controllers/main-controller';
import FormController from './controllers/form-controller';

app.controller('MainController', MainController);
app.controller('formController', FormController);

//app.config(require('./routes'));

app.factory('httpInterceptor', require('./factories/httpInterceptor'));

app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
});
app.config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
    ngQuillConfigProvider.set(null, null, 'custom placeholder')
}])
app.config(require('./states'));

app.provider('ngQuillConfig', require('./providers/ngQuillConfig'));

app.directive("ngLoader", require('./directives/ngLoader'));
app.component('ngQuillEditor', require('./components/ngQuilleditor')());

app.constant('pdfStylesheet', require('./constants/pdf-stylesheet')());

