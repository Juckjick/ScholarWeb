(function () {
    "use strict";

    angular.module('sms.reports').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/reports/student', {
                templateUrl: 'partials/reports/public/views/reports.student.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/reports/student');
                    }]
                }
            })
            .when('/reports/loan', {
                templateUrl: 'partials/reports/public/views/reports.loan.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/reports/loan');
                    }]
                }
            })
            .when('/reports/scholarship', {
                templateUrl: 'partials/reports/public/views/reports.scholarship.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/reports/scholarship');
                    }]
                }
            })
            .when('/reports/result', {
                templateUrl: 'partials/reports/public/views/reports.result.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/reports/result');
                    }]
                }
            });
    }]);
})();
