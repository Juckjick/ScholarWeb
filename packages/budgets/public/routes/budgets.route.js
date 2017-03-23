(function () {
    "use strict";

    angular.module('sms.applications').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/budgets/main/create', {
                templateUrl: 'partials/budgets/public/views/mains/budgets.mains.create.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/main/create');
                    }]
                }
            })
            .when('/budgets/main/list', {
                templateUrl: 'partials/budgets/public/views/mains/budgets.mains.list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/main/list');
                    }]
                }
            })
            .when('/budgets/sub/create', {
                templateUrl: 'partials/budgets/public/views/subs/budgets.subs.create.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/sub/create');
                    }]
                }
            })
            .when('/budgets/sub/list', {
                templateUrl: 'partials/budgets/public/views/subs/budgets.subs.list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/sub/list');
                    }]
                }
            })
            .when('/budgets/transactions/edit', {
                templateUrl: 'partials/budgets/public/views/transactions/budgets.transactions.add.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/transactions/edit');
                    }]
                }
            })
            .when('/budgets/graphs/chart', {
                templateUrl: 'partials/budgets/public/views/graphs/budgets.graphs.chart.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/graphs/chart');
                    }]
                }
            })
            .when('/budgets/graphs/table', {
                templateUrl: 'partials/budgets/public/views/graphs/budgets.graphs.table.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/budgets/graphs/table');
                    }]
                }
            });

    }]);
})();
