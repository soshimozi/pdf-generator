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

 app.provider('ngQuillConfig', function () {
    var config = {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image', 'video']                         // link and image, video
        ]
      },
      theme: 'snow',
      placeholder: 'Insert text here ...',
      readOnly: false,
      bounds: document.body
    }

    this.set = function (customConf) {
      customConf = customConf || {}

      if (customConf.modules) {
        config.modules = customConf.modules
      }
      if (customConf.theme) {
        config.theme = customConf.theme
      }
      if (customConf.placeholder !== null && customConf.placeholder !== undefined) {
        config.placeholder = customConf.placeholder.trim()
      }
      if (customConf.bounds) {
        config.bounds = customConf.bounds
      }
      if (customConf.readOnly) {
        config.readOnly = customConf.readOnly
      }
      if (customConf.formats) {
        config.formats = customConf.formats
      }
    }

    this.$get = function () {
      return config
    }
  })

app.config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
    ngQuillConfigProvider.set(null, null, 'custom placeholder')
}])

app.directive("ngLoader", require('./directives/ngLoader'));
app.component('ngQuillEditor', require('./components/ngQuilleditor')());

