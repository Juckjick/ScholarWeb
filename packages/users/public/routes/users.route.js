(function () {
    "use strict";

    angular.module('sms.users').config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/systems/users/create', {
                    templateUrl: 'partials/users/public/views/users.create.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/systems/users/create');
                        }]
                    }
                })
                .when('/systems/users/list', {
                    templateUrl: 'partials/users/public/views/users.list.view',
                    resolve: {
                        permission: ['Authorization', function (Authorization) {
                            return Authorization.verifyAuthorization('/systems/users/list');
                        }]
                    }
                })
                .when('/systems/users/profile', {
                    templateUrl: 'partials/users/public/views/users.profile.view',
                    controller: 'UsersProfileController',
                    controllerAs: 'vm'
                });
        }]);
})();
