(function () {
    "use strict";

    angular.module('sms.settings').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/settings/academicyear/create', {
                templateUrl: 'partials/settings/public/views/academicyears/settings.academicyears.create.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/settings/academicyear/create');
                    }]
                }
            })
            .when('/settings/academicyear/list', {
                templateUrl: 'partials/settings/public/views/academicyears/settings.academicyears.list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/settings/academicyear/list');
                    }]
                }
            });
    }]);
})();