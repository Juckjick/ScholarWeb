(function() {
    'use strict';

    angular
        .module('sms.applications')
        .controller('InterviewsEditController', InterviewsEdit);

    InterviewsEdit.$inject = ['$location', 'Interviews'];

    function InterviewsEdit($location, Interviews) {
        var vm = this;

        /**
         * Variables
         */
        vm.students = [];
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        // Pagination
        vm.currentPage = 1;
        vm.itemsPerPage = 10;

        /**
         * Functions
         */
        vm.calculateStartEndPage = calculateStartEndPage;
        vm.editApplication = editApplication;


        init();

        function init() {

            // Load all students' profiles from database
            // who applied the scholarship this year
            Interviews.loadStudents().success(function(students) {
                vm.students = students || [];
                initPagination();
            });
        }

        /**
         * Change the start/end page
         * @param newPage is a new page number
         */
        function calculateStartEndPage(newPage) {
            vm.startPage = ((newPage - 1) * vm.itemsByPage) + 1;
            vm.endPage = newPage * vm.itemsByPage;

            initPagination();
        }

        /**
         * Initialize pagination
         */
        function initPagination() {
            // Set number of end page equals to
            // students array length if the end page
            // is greater than students array length
            if (vm.endPage > vm.students.length)
                vm.endPage = vm.students.length;
        }

        /**
         * Edit a student application by redirecting it to an apply page
         * along with the given StudentId
         * @param  {Integer, Integer} StudentId of a student and AcademicYearId
         */
        function editApplication(StudentId, AcademicYearId) {
            $location.path('/scholarships/edit/application/' + StudentId + '/' + AcademicYearId);
        }


    }
})();
