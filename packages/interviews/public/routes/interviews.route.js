(function () {
    "use strict";

    angular.module('sms.interviews').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/scholarships/interview/evaluation/list', {
                templateUrl: 'partials/interviews/public/views/interviews.evaluation-list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/interview/evaluation/list');
                    }]
                }
            })
            .when('/scholarships/interview/summary/list', {
                templateUrl: 'partials/interviews/public/views/interviews.summary-list.view',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/interview/summary/list');
                    }]
                }
            })
            .when('/scholarships/interview/evaluation/:StudentId/:AcademicYearId', {
                templateUrl: 'partials/interviews/public/views/interviews.evaluation.view',
                controller: 'InterviewsEvaluationController',
                controllerAs: 'evaluationCtrl',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/interview/evaluation/:StudentId/:AcademicYearId');
                    }],
                    profileData: ['$route', 'Scholarships', function ($route, Scholarships) {
                        var StudentId = $route.current.params.StudentId,
                            AcademicYearId = $route.current.params.AcademicYearId;
                        return Scholarships.getPromises(StudentId, AcademicYearId);
                    }],
                    profilePic: ['$route', 'Interviews', function ($route, Interviews) {
                        var data = {};
                        data.StudentId = $route.current.params.StudentId;
                        data.AcademicYearId = $route.current.params.AcademicYearId;
                        return Interviews.loadProfilePic(data).then(function (response) {
                            return response.data;
                        });
                    }]
                }
            })
            .when('/scholarships/interview/summary/:StudentId/:AcademicYearId', {
                templateUrl: 'partials/interviews/public/views/interviews.summary.view',
                controller: 'InterviewsSummaryController',
                controllerAs: 'vm',
                resolve: {
                    permission: ['Authorization', function (Authorization) {
                        return Authorization.verifyAuthorization('/scholarships/interview/summary/:StudentId/:AcademicYearId');
                    }],
                    profileData: ['$route', 'Scholarships', function ($route, Scholarships) {
                        var StudentId = $route.current.params.StudentId,
                            AcademicYearId = $route.current.params.AcademicYearId;
                        return Scholarships.getPromises(StudentId, AcademicYearId);
                    }],
                    profilePic: ['$route', 'Interviews', function ($route, Interviews) {
                        var data = {};
                        data.StudentId = $route.current.params.StudentId;
                        data.AcademicYearId = $route.current.params.AcademicYearId;
                        return Interviews.loadProfilePic(data).then(function (response) {
                            return response.data;
                        });
                    }]
                }
            });
    }]);
})();