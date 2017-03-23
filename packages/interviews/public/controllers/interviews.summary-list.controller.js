(function() {
    'use strict';

    angular
        .module('sms.interviews')
        .controller('InterviewsSummaryListController', InterviewsSummaryList);

    InterviewsSummaryList.$inject = ['Interviews'];

    function InterviewsSummaryList(Interviews) {
        var vm = this;

        /**
         * Variables
         * @type {Array}
         */
        vm.students = [];
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        /**
         * Functions
         */
        vm.calculateStartEndPage = calculateStartEndPage;

        init();

        function init() {

            // Load all students' profiles from database
            // who applied the scholarship this year
            Interviews.loadStudents().success(function(students) {
                vm.students = students || [];

                initPagination();

                // Check which students has been summarized,
                // So, we'll bind a status to be displayed in the table
                // data.UserId = Global.user.id;
                Interviews.loadAllSummaries().success(function(summaries) {
                    angular.forEach(students, function(student) {
                        angular.forEach(summaries, function(summary) {
                            if (student.UserId === summary.StudentId && student.AcademicYearId === summary.AcademicYearId) {
                                student.hasEvaluated = true;
                                student.isGetScholarship = summary.getScholarship;
                            }
                        });
                    });
                });
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

    }
})();
