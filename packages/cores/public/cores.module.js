(function () {
    'use strict';

    angular
        .module('sms', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'angularFileUpload', 'validation', 'validation.rule', 'ui.bootstrap.datepicker.be', 'smart-table', 'sms.users', 'sms.roles', 'sms.applications', 'sms.interviews', 'sms.budgets', 'sms.reports', 'sms.settings']);

    //angular.module('sms.settings', ['frapontillo.bootstrap-switch']);

    // Custom configs
    angular.module('sms')
        .config(['$compileProvider', '$locationProvider', function ($compileProvider, $locationProvider) {
            // Add a link begin with "data:" to the whitelist of angular
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);

            //Setting HTML5 Location Mode
            $locationProvider.hashPrefix("!");
        }])
        .constant('_', window._)
        .constant('moment', window.moment)
        .run(runApplication);

    runApplication.$inject = ['$rootScope'];
    function runApplication($rootScope) {
        $rootScope._ = window._;
        $rootScope.moment = window.moment;
    }

})();
