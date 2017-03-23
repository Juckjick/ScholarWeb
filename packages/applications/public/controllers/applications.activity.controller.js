(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsActivityController', ScholarshipsActivity);

    ScholarshipsActivity.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];
    function ScholarshipsActivity(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.activity = {};

        /**
         * Functions
         */
        vm.upsertActivity = upsertActivity;

        init();

        // Initialize data
        function init() {
            vm.activity = Scholarships.getActivity() || {};
        }

        // Update or insert activity 
        function upsertActivity() {
            var data = {};

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.activity = vm.activity;

            vm.isSubmit = true;

            $http.post('/api/scholarships/upsert/activity', data).success(function (activity) {
                vm.isSuccess = true;
                // Reinit data for the sake of getting an id from DB
                Scholarships.reInit($routeParams.StudentId, $routeParams.AcademicYearId).then(function () {
                    init();
                    $timeout(function () {
                        vm.isSaved = true;
                        vm.isSuccess = false;
                        vm.isSubmit = false;
                    }, 5000);
                });
            }).error(function (err) {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);

            });
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.sixth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }
})();
