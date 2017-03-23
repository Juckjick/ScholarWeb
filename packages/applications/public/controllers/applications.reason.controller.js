(function () {
    'use strict';
    angular
        .module('sms.applications')
        .controller('ScholarshipsReasonController', ScholarshipsReason);

    ScholarshipsReason.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsReason(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.reason = {};
        vm.scholarships = [];

        /**
         * Functions
         */
        vm.upsertReason = upsertReason;
        vm.addCurrentScholarship = addCurrentScholarship;
        vm.deleteCurrentScholarship = deleteCurrentScholarship;

        init();
        // Initialize data
        function init() {
            vm.reason = Scholarships.getReason() || {};
            vm.scholarships = Scholarships.getScholarshipsByMomentId(2) || [];
        }

        // Update or insert reason 
        function upsertReason() {
            var data = {};

            vm.isSubmit = true;

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.reason = vm.reason;
            data.scholarships = vm.scholarships;

            $http.post('/api/scholarships/upsert/reason', data).success(function (reason) {
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

        // Add a scholarship field
        function addCurrentScholarship() {
            vm.scholarships.push({});
        }

        // Delete a scholarship field
        function deleteCurrentScholarship(index) {
            vm.scholarships.splice(index, 1);
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.eighth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
