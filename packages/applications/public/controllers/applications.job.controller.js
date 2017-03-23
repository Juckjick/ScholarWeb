(function () {
    'use strict';
    angular
        .module('sms.applications')
        .controller('ScholarshipsJobController', ScholarshipsJob);

    ScholarshipsJob.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsJob(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.profile = {};
        vm.jobs = [];

        /**
         * Functions
         */
        vm.sanitizeJob = sanitizeJob;
        vm.upsertJob = upsertJob;

        init();

        // Initialize data
        function init() {
            vm.profile = Scholarships.getProfile();
            vm.jobs = Scholarships.getJobs();

            // Set default JobId to ราชการ
            // if the profile.JobId has never been created
            if (!vm.profile.hasOwnProperty('JobId'))
                vm.profile.JobId = 1;
            else
                vm.hasIndatabase = true;
        }

        // Set JobNote object, if JobId isn't equal to 6
        // JobNote should be null
        function sanitizeJob(jobId) {
            if (jobId != 6)
                vm.profile.JobNote = null;
        }

        // Update or insert job into the profile table 
        function upsertJob() {
            var data = {};
            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.profile = vm.profile;

            vm.isSubmit = true;

            $http.post('/api/scholarships/upsert/job', data).success(function (profile) {
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
            return $scope.ninth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
