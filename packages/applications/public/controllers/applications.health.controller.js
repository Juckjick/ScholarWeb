(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsHealthController', ScholarshipsHealth);

    ScholarshipsHealth.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsHealth(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.health = {};

        /**
         * Functions
         */
        vm.upsertHealth = upsertHealth;
        vm.sanitizeHealth = sanitizeHealth;

        init();

        // Initialize data
        function init() {
            vm.health = Scholarships.getHealth() || {};

            // Set default value to the checkbox
            if (vm.health.admitYear) vm.isAdmit = true;
        }

        // Update or insert health 
        function upsertHealth() {
            var data = {};
            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.health = vm.health;

            vm.isSubmit = true;

            $http.post('/api/scholarships/upsert/health', data).success(function (health) {
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

        // Delete admit properties from health object
        // when the user unchecked the isAdmit checkbox
        function sanitizeHealth() {
            if (!vm.isAdmit) {
                delete vm.health.admitYear;
                delete vm.health.admitDisease;
                delete vm.health.admitDay;
                delete vm.health.admitMoney;
            }
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.fifth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
