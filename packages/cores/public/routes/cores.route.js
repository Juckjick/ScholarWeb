(function () {
    'use strict';

    //Setting up route
    angular.module('sms').config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider

                .when('/systems', {
                    templateUrl: 'partials/cores/public/views/cores.index.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/systems');
                        }]
                    }

                })
                .when('/scholarships', {
                    templateUrl: 'partials/cores/public/views/cores.index.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/scholarships');
                        }]
                    }
                })
                .when('/budgets', {
                    templateUrl: 'partials/cores/public/views/cores.index.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/budgets');
                        }]
                    }
                })
                .when('/reports', {
                    templateUrl: 'partials/cores/public/views/cores.index.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/reports');
                        }]
                    }
                })
                .when('/settings', {
                    templateUrl: 'partials/cores/public/views/cores.index.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/settings');
                        }]
                    }
                })
                .when('/', {
                    templateUrl: 'partials/cores/public/views/cores.index.view'
                })

                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);

})();
