(function () {
    'use strict';

    angular
        .module('sms.interviews')
        .controller('InterviewsEvaluationController', InterviewsEvaluation);

    InterviewsEvaluation.$inject = ['Global', '$timeout', '$routeParams', '$location', '$anchorScroll', 'Interviews', 'Budgets', 'Scholarships', 'profilePic'];

    function InterviewsEvaluation(Global, $timeout, $routeParams, $location, $anchorScroll, Interviews, Budgets, Scholarships, profilePic) {
        var vm = this;

        /**
         * Variables
         */
        vm.criteria = [];
        vm.budgets = [];
        vm.result = {};
        vm.summaries = [];

        /**
         * Functions
         */
        vm.filterSubBudgets = filterSubBudgets;
        vm.upsertEvaluation = upsertEvaluation;

        init();

        function init() {
            var data = {};

            data.StudentId = $routeParams.StudentId;
            data.EvaluatorId = Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId;

            // Load all criteria from database
            Interviews.loadCriteria().success(function (criteria) {
                vm.criteria = criteria || [];
            });

            vm.profile = Scholarships.getProfile();
            vm.oldAddress = Scholarships.getAddressByMomentId(1);
            vm.newAddress = Scholarships.getAddressByMomentId(1);
            vm.father = Scholarships.getFamilyMember(1);
            vm.mother = Scholarships.getFamilyMember(2);
            vm.adopter = Scholarships.getFamilyMember(3);
            vm.reason = Scholarships.getReason();
            vm.scholarships = Scholarships.getScholarshipsByMomentId(1);
            vm.adoption = Scholarships.getAdoption();

            // Set a profile picture
            if (profilePic &&
                (profilePic.mimetype === 'image/png' ||
                profilePic.mimetype === 'image/jpg' ||
                profilePic.mimetype === 'image/jpeg'))
                vm.file = profilePic;

            // Load a scholarship that the student have gotten before
            Interviews.loadAllOldSummariesByStudentIdAcademicYearId(data).success(function (summaries) {
                vm.summaries = summaries || [];
            });

            // Get main budgets joined with sub budgets
            Budgets.loadMainSubBudgetOfCurrentAcademicYear().success(function (budgets) {
                vm.budgets = budgets || [];


                // Load an evaluation from DB, in case that the evaluator has been evaluated
                // and wants to modify the result
                Interviews.loadEvaluation(data).success(function (result) {

                    if (result) {
                        vm.result = result;
                        if (vm.result.SubBudgetId) {
                            vm.BudgetId = vm.result.SubBudget.BudgetId;
                            // Load sub budgets
                            if (vm.budgets.length && vm.BudgetId) {
                                vm.filterSubBudgets();
                            }
                        }
                    } else {
                        vm.result = {};
                        // Set default getScholarship
                        vm.result.getScholarship = false;
                    }
                });
            });
        }

        /**
         * Show only sub budgets of the selected main budget
         */
        function filterSubBudgets() {
            angular.forEach(vm.budgets, function (budget) {
                if (budget.id === vm.BudgetId)
                    vm.subBudgets = budget.SubBudgets;
            });
        }

        function upsertEvaluation() {
            var data = {};
            vm.isSubmit = true;

            if (isDataCorrect()) {
                // Set Evaluator as a current logged in users
                vm.result.EvaluatorId = Global.user.id;

                // Set StudentId  and AcademicYearId
                vm.result.StudentId = $routeParams.StudentId;
                vm.result.AcademicYearId = $routeParams.AcademicYearId;

                // if the student doesn't get a scholarship
                // set the SubBudgetId = null
                if (!vm.result.getScholarship) {
                    vm.result.SubBudgetId = null;
                }
                // Upsert an evaluation
                data.result = vm.result;
                Interviews.upsertEvaluation(data).success(function () {
                    vm.isSuccess = true;
                    // Scroll to #top, and then reset the route back to normal,
                    // without #top, by setting $localtion.hash(null)
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash(null);

                    $timeout(function () {
                        // Reinit data for the sake of getting an id from DB
                        init();

                        vm.isSuccess = false;
                        vm.isSubmit = false;
                    }, 5000);
                }).error(function () {
                    vm.isError = true;
                    // Scroll to #top, and then reset the route back to normal,
                    // without #top, by setting $localtion.hash(null)
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash(null);

                    $timeout(function () {
                        vm.isError = false;
                        vm.isSubmit = false;
                    }, 5000);
                });
            } else {
                vm.isSubmit = false;
            }

        }

        /**
         * Criteria radios should be all chosen
         */
        function isDataCorrect() {
            if (typeof vm.result.score1 === 'number' &&
                typeof vm.result.score2 === 'number' &&
                typeof vm.result.score3 === 'number' &&
                typeof vm.result.score4 === 'number' &&
                typeof vm.result.score5 === 'number') {
                vm.scoreRequired = false;
                return true;
            } else {
                vm.scoreRequired = true;
                return false;
            }
        }
    }
})();
