(function() {
    'use strict';

    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.reports')
        .factory("Reports", Reports);

    Reports.$inject = ['Global', '$http'];

    function Reports(Global, $http) {
        var reportFactory = {};

        /**
         * Functions
         */
        reportFactory.loadResult = loadResult;
        reportFactory.loadLoan = loadLoan;
        reportFactory.loadScholarship = loadScholarship;
        reportFactory.loadAllStudents = loadAllStudents;
        reportFactory.loadStudentProfiles = loadStudentProfiles;
        reportFactory.saveStudentIdAcademicYearId = saveStudentIdAcademicYearId;

        return reportFactory;

        /**
         * Load all students from InterviewSummary who got a scholarship joined with
         * Users, BudgetTransactions, SubBudgets, and Budgets
         * @param  {Object} data
         * @return {Promise} of summary
         */
        function loadResult(data) {
            return $http.post('/api/reports/load/results', data);
        }

        /**
         * Load all studens from InterviewSummary, whether they got it or not
         * joined with Users, BudgetTransactions, SubBudgets, and Budgets
         * @param  {Object} data
         * @return {Promise} of summary
         */
        function loadLoan(data) {
            return $http.post('/api/reports/load/loans', data);
        }

        /**
         * Load all studens from InterviewSummary who got a scholarship
         * joined with Users, BudgetTransactions, SubBudgets, and Budgets
         * @param  {Object} data
         * @return {Promise} of summary
         */
        function loadScholarship(data) {
            return $http.post('/api/reports/load/scholarships', data);
        }

        /**
         * Load all students' profiles from database
         * who have applied a scholarship
         * @param  {Object} data
         * @return {Promise} of students
         */
        function loadAllStudents() {
            return $http.post('/api/reports/load/all-students');
        }


        /**
         * Get all information about this user,
         * including his applications versions
         * @return {Promise} of student
         */
        function loadStudentProfiles(data) {
            return $http.post('/api/reports/load/student-profiles', data);
        }

        /**
         * Save a StudentId and Version data before
         * requesting the "get" data for exporting a pdf file
         * @param  {Object} data
         * @return {Promise} of the request
         */
        function saveStudentIdAcademicYearId(data) {
            return $http.post('/api/reports/save/studentid-academicyearid', data);
        }

    }

})();
