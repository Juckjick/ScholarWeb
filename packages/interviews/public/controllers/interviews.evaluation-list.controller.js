(function() {
    'use strict';

    angular
        .module('sms.interviews')
        .controller('InterviewsEvaluationListController', InterviewsEvaluationList);

    InterviewsEvaluationList.$inject = ['Global', 'Interviews'];

    function InterviewsEvaluationList(Global, Interviews) {
        var vm = this;

        /**
         * Variables
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
                var data = {};
                vm.students = students || [];

                initPagination();

                // Check which students has been evaluated,
                // So, we'll bind a status to be displayed in the table
                data.EvaluatorId = Global.user.id;
                Interviews.loadAllEvaluationsByEvaluatorId(data).success(function(evaluations) {
                    angular.forEach(students, function(student) {
                        angular.forEach(evaluations, function(evaluation) {
                            if (student.UserId === evaluation.StudentId && student.AcademicYearId === evaluation.AcademicYearId)
                                student.hasEvaluated = true;
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
