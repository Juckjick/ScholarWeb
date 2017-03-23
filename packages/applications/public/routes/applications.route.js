(function () {
    "use strict";

    angular.module('sms.applications').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/scholarships/apply', {
                templateUrl: 'partials/applications/public/views/applications.index.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/apply');
                    }],
                    alreadyApplied: ['Global', 'Authorization', function (Global, Authorization) {
                        return Authorization.verifyAlreadyApplied(Global.user.id);
                    }],
                    IsScholarshipOpen: ['Authorization', function (Authorization) {
                        return Authorization.verifyIsScholarshipOpen();
                    }],
                    data: ['Scholarships', function (Scholarships) {
                        return Scholarships.getPromises();
                    }]
                }
            })
            .when('/scholarships/apply/complete', {
                templateUrl: 'partials/applications/public/views/applications.complete.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/apply/complete');
                    }]
                }
            })
            .when('/scholarships/edit/application/:StudentId/:AcademicYearId', {
                templateUrl: 'partials/applications/public/views/applications.index.view',
                resolve: {
                    data: ['Scholarships', '$route', function (Scholarships, $route) {
                        var StudentId = $route.current.params.StudentId;
                        var AcademicYearId = $route.current.params.AcademicYearId;
                        return Scholarships.getPromises(StudentId, AcademicYearId);
                    }],
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/edit/application/:StudentId/:AcademicYearId');
                    }]
                }
            })
            .when('/scholarships/edit/list', {
                templateUrl: 'partials/applications/public/views/applications.edit-list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/edit/list');
                    }]
                }
            })
            .when('/scholarships/setting', {
                templateUrl: 'partials/applications/public/views/applications.setting.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/setting');
                    }]
                }
            });

    }]);
})();