(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsProfileController', ScholarshipsProfile);

    ScholarshipsProfile.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsProfile(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.provinces = {};
        vm.profile = {};
        vm.oldAddress = {};
        vm.newAddress = {};

        /**
         * Functions
         */
        vm.upsertProfile = upsertProfile;
        vm.openBirthDate = openBirthDate;

        init();

        // Initialize data
        function init() {
            vm.titles = Scholarships.getTitles();
            vm.provinces = Scholarships.getProvinces();
            vm.profile = Scholarships.getProfile();
            vm.oldAddress = Scholarships.getAddressByMomentId(1);
            vm.newAddress = Scholarships.getAddressByMomentId(2);
        }

        // Update or insert user profiles
        function upsertProfile() {
            var data = {};

            vm.isSubmit = true;

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            // Bind profiles and addresses properties
            data.data = vm.profile;
            data.oldAddress = vm.oldAddress;
            data.newAddress = vm.newAddress;
            data.oldAddress.ProvinceId = vm.oldAddress.ProvinceId;
            data.newAddress.ProvinceId = vm.newAddress.ProvinceId;

            $http.post('/api/scholarships/upsert/profile', data).success(function (res) {
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

        // Date picker
        function openBirthDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedBirthDate = true;
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.first;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
