(function () {
    "use strict";

    angular.module('sms.roles').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/systems/roles/create', {
                templateUrl: 'partials/roles/public/views/roles.create.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/systems/roles/create');
                    }]
                }
            })
            .when('/systems/roles/list', {
                templateUrl: 'partials/roles/public/views/roles.list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/systems/roles/list');
                    }]
                }
            });

    }]);
})();
