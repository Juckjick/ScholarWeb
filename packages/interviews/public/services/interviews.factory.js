(function() {
    'use strict';

    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.interviews')
        .factory("Interviews", Interviews);

    Interviews.$inject = ['Global', '$http'];

    function Interviews(Global, $http) {
        var interviewFactory = {};

        /**
         * Functions
         */
        interviewFactory.loadCriteria = loadCriteria;
        interviewFactory.loadStudents = loadStudents;
        interviewFactory.loadEvaluation = loadEvaluation;
        interviewFactory.loadAllEvaluationsByStudentIdAcademicYearId = loadAllEvaluationsByStudentIdAcademicYearId;
        interviewFactory.loadAllEvaluationsByEvaluatorId = loadAllEvaluationsByEvaluatorId;
        interviewFactory.loadSummary = loadSummary;
        interviewFactory.loadAllSummaries = loadAllSummaries;
        interviewFactory.loadAllOldSummariesByStudentIdAcademicYearId = loadAllOldSummariesByStudentIdAcademicYearId;
        interviewFactory.loadProfilePic = loadProfilePic;
        interviewFactory.upsertEvaluation = upsertEvaluation;
        interviewFactory.upsertSummary = upsertSummary;

        return interviewFactory;

        /**
         * Load Criteria from DB
         * @return {Promise} of criteria
         */
        function loadCriteria() {
            return $http.post('/api/scholarships/load/criteria', Global.user);
        }

        /**
         * Load Students' profile
         * who applied the scholarship this year
         * @return {Promise} of student
         */
        function loadStudents() {
            return $http.post('/api/scholarships/load/student-profiles');
        }

        /**
         * Load a data from InterviewEvaluation
         * @param  {Object} data including UserId, EvaluatorId, and AcademicYearId
         * @return {Promise} of evaluation
         */
        function loadEvaluation(data) {
            return $http.post('/api/scholarships/load/evaluation', data);
        }

        /**
         * Load an entire evaluations by a given StudentId
         * @param  {Object} data, included only an StudentId
         * @return {Promise} of evaluation
         */
        function loadAllEvaluationsByStudentIdAcademicYearId(data) {
            return $http.post('/api/scholarships/load/all-evaluation-by-studentid-academicyearid', data);
        }

        /**
         * Load an entire evaluations by a given EvaluatorId
         * @param  {Object} data, included only an EvaluatorId
         * @return {Promise} of evaluation
         */
        function loadAllEvaluationsByEvaluatorId(data) {
            return $http.post('/api/scholarships/load/all-evaluation-by-evaluatorid', data);
        }

        /**
         * Load a data from InterviewSummary
         * @param  {Object} data including StudentId and AcademicYearId
         * @return {Promise} of summary, including BudgetTransaction
         */
        function loadSummary(data) {
            return $http.post('/api/scholarships/load/summary', data);
        }

        function loadAllSummaries() {
            return $http.post('/api/scholarships/load/all-summaries');
        }

        function loadProfilePic(data) {
            return $http.post('/api/interviews/load/profile-pic', data);
        }

        /**
         * Load a data from InterviewSummary
         * @param  {Object} data including StudentId and AcademicYearId
         * @return {Promise} of summary, including BudgetTransaction
         */
        function loadAllOldSummariesByStudentIdAcademicYearId(data) {
            return $http.post('/api/scholarships/load/all-old-summary-by-studentid-academicyearid', data);
        }

        /**
         * Upsert evaluation result
         * @param  {Object} data to be upserted
         * @return {Promise} of evaluation
         */
        function upsertEvaluation(data) {
            return $http.post('/api/scholarships/upsert/evaluation', data);
        }

        /**
         * Upsert summary result
         * @param  {Object} data to be upserted
         * @return {Promise} of summary
         */
        function upsertSummary(data) {
            return $http.post('/api/scholarships/upsert/summary', data);
        }

    }
})();
