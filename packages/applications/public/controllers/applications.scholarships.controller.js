(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsScholarshipController', ScholarshipsScholarship);

    ScholarshipsScholarship.$inject = ['Global', '$http', '$timeout', '$scope', '$routeParams', 'Scholarships'];

    function ScholarshipsScholarship(Global, $http, $timeout, $scope, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.profile = {};
        vm.scholarships = [];
        vm.faculties = [];
        vm.departments = [];

        /**
         * Functions
         */
        vm.upsertOldScholarship = upsertOldScholarship;
        vm.addScholarship = addScholarship;
        vm.deleteScholarship = deleteScholarship;
        vm.sanitizeScholarship = sanitizeScholarship;
        vm.sanitizeProfile = sanitizeProfile;

        init();

        // Initialize data
        function init() {
            vm.profile = Scholarships.getProfile();
            vm.scholarships = Scholarships.getScholarshipsByMomentId(1);
            vm.faculties = Scholarships.getFacultiesDepartments();
            vm.majors = Scholarships.getMajors();

            // Set default hasScholarship to false 
            // if the profile.hasScholarship has never been created
            if (!vm.profile.hasOwnProperty('hasScholarship'))
                vm.profile.hasScholarship = false;

            // Set default departments based on the selected faculty id
            if (vm.profile.FacultyId)
                vm.departments = vm.faculties[vm.profile.FacultyId - 1].Departments;
            //else vm.departments = vm.faculties[vm.profile.FacultyId - 1].Departments;
                
        }

        // Update or insert old scholarship 
        function upsertOldScholarship() {
            var data = {};

            vm.isSubmit = true;

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.profile = vm.profile;

            // If user checked on hasScholarship
            if (vm.profile.hasScholarship)
                data.scholarships = vm.scholarships;

            $http.post('/api/scholarships/upsert/old-scholarships', data).success(function (hs) {
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
        function addScholarship() {
            vm.scholarships.push({});
        }

        // Delete a scholarship field
        function deleteScholarship(index) {
            vm.scholarships.splice(index, 1);
        }

        // Sanitize scholarships array
        function sanitizeScholarship() {
            // If a user checked on hasScholarship, at least 
            // a scholarship should be added into scholarships array        
            if (vm.profile.hasScholarship && !vm.scholarships.length)
                vm.addScholarship();

            // If a user checked off hasScholarship, and
            // scholarships array has some data, it should be emptied 
            else if (!vm.profile.hasScholarship && vm.scholarships.length)
                vm.scholarships = [];
        }

        // Sanitize profile object
        function sanitizeProfile() {
            // Clear some profile attributes 
            // which are used only for a current student
            // not for a freshman
            if (vm.profile.isNewStudent) {
                vm.profile.advisor = null;
                vm.profile.gpa = null;
                vm.profile.academicYear = null;
            }
        }

        // Filter the departments field based on faculties field
        $scope.$watch(function () {
            return vm.profile.FacultyId;
        }, function (newValue, oldValue) {
            if (vm.profile.FacultyId && (newValue !== oldValue))
                vm.departments = vm.faculties[vm.profile.FacultyId - 1].Departments;
        });

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.second;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);
    }

})();
