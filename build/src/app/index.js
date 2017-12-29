const angular = require('angular');

require('angular-ui-bootstrap');
require('jquery/dist/jquery');
require('ngclipboard');
require('angular-animate');
require('angular-formly');
require('angular-formly-templates-bootstrap');
require('flux-angular');

import '../../node_modules/font-awesome/css/font-awesome.css';
import './styles/app.css';
import './styles/pdf-styles.css';
import './styles/angular-wizard.less';
// import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';

//import '../../node_modules/bootswatch/dist/flatly/bootstrap.min.css'
//import '../../node_modules/bootstrap/dist/css/bootstrap.css';

import uiRouter from "@uirouter/angularjs";

const app = angular.module('test-pdf-generation-app', [
    // 'ngRoute',
    'ui.bootstrap',
    'ngclipboard',
    'formly',
    'formlyBootstrap',
    'ngAnimate',
    uiRouter,
    'flux'
]);

import MainController from './controllers/main-controller';
import WizardController from './controllers/wizard-controller';

//import WizardService from './services/wizardservice';

app.controller('MainController', MainController);
app.controller('WizardController', WizardController);

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

app.run(function($transitions) {
  $transitions.onSuccess({ }, function(trans) {
    var StateService = trans.injector().get('StateService');
    StateService.changeStateName(trans.router.stateService.current.name);
  });
})

app.store('StateStore', function () {
  return {
    initialize: function () {
      this.state = this.immutable({
        currentState: {
          name: ''
        }
      });
    },
    handlers: {
      CHANGE_STATE_NAME: 'changeStateName'
    },
    changeStateName: function(payload) {
      this.state.set(['currentState', 'name'], payload.name);
    },
    exports: {
      get state() {
        return this.state.get('currentState');
      }
    }
  };
})
.service('StateService', require('./services/stateservice'));
