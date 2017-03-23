(function () {
    'use strict';

    angular
        .module('sms.interviews')
        .controller('InterviewsSummaryController', InterviewsSummary);

    InterviewsSummary.$inject = ['Global', '_', '$timeout', '$routeParams', '$window', '$location', '$anchorScroll', 'Interviews', 'Budgets', 'Scholarships', 'Reports', 'profilePic'];

    function InterviewsSummary(Global, _, $timeout, $routeParams, $window, $location, $anchorScroll, Interviews, Budgets, Scholarships, Reports, profilePic) {
        var vm = this;

        /**
         * Variables
         */
        vm.budgets = [];
        vm.result = {};
        vm.summaries = [];
        vm.evaluations = [];
        vm.criteria = [];
        vm.giveScholarships = [];

        /**
         * Functions
         */
        vm.filterSubBudgets = filterSubBudgets;
        vm.upsertSummary = upsertSummary;
        vm.exportPdf = exportPdf;
        vm.exportFile = exportFile;
        vm.addGiveScholarship = addGiveScholarship;
        vm.deleteGiveScholarship = deleteGiveScholarship;

        init();

        function init() {
            var data = {};
            data.StudentId = $routeParams.StudentId;
            data.AcademicYearId = $routeParams.AcademicYearId;

            vm.profile = Scholarships.getProfile();
            vm.oldAddress = Scholarships.getAddressByMomentId(1);
            vm.newAddress = Scholarships.getAddressByMomentId(1);
            vm.father = Scholarships.getFamilyMember(1);
            vm.mother = Scholarships.getFamilyMember(2);
            vm.adopter = Scholarships.getFamilyMember(3);
            vm.reason = Scholarships.getReason();
            vm.scholarships = Scholarships.getScholarshipsByMomentId(1);
            vm.adoption = Scholarships.getAdoption();
            vm.files = Scholarships.getUploadedFiles();

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

            Interviews.loadAllEvaluationsByStudentIdAcademicYearId(data).success(function (evaluations) {
                vm.evaluations = evaluations;
                calculateAvgScore();
            });

            // Get main budgets joined with sub budgets
            Budgets.loadMainSubBudgetOfCurrentAcademicYear().success(function (budgets) {
                vm.budgets = budgets || [];

                // Load a summary from DB
                // In case that a user wants to modify the result
                Interviews.loadSummary(data).success(function (summary) {
                    if (summary) {
                        vm.summary = summary;
                        vm.giveScholarships = angular.copy(vm.summary.BudgetTransactions);

                        // Bind BudgetId to each scholarship and load the sub budgets filter
                        _.each(vm.giveScholarships, function (scholarship) {
                            scholarship.BudgetId = scholarship.SubBudget.BudgetId;
                            vm.filterSubBudgets(scholarship);
                        });

                    } else {
                        vm.summary = {};

                        // Set default getScholarship
                        vm.summary.getScholarship = false;
                    }
                });
            });
        }

        /**
         * Show only sub budgets of the selected main budget
         */
        function filterSubBudgets(scholarship) {
            if (scholarship) {
                _.each(vm.budgets, function (budget) {
                    if (scholarship.BudgetId === budget.id) {
                        scholarship.subBudgets = budget.SubBudgets;
                    }
                });
            }
        }

        /**
         * Update or insert a summary result
         */
        function upsertSummary() {

            var data = {};
            vm.isSubmit = true;

            // Save old BudgetTransactions
            data.oldBudgetTransactions = vm.summary.BudgetTransactions || [];

            prepareSummary(data);
            prepareBudgetTransactions(data);

            Interviews.upsertSummary(data).success(function () {
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
        }

        /**
         * Prepare summary data for persisting to DB
         * @param data
         */
        function prepareSummary(data) {
            data.summary = {};

            data.summary.id = vm.summary.id;
            data.summary.getScholarship = vm.summary.getScholarship;

            // Set Evaluator as a current logged in users
            data.summary.EvaluatorId = Global.user.id;

            // Set StudentId  and AcademicYearId
            data.summary.StudentId = $routeParams.StudentId;
            data.summary.AcademicYearId = $routeParams.AcademicYearId;
        }

        /**
         * Prepare BudgetTransactions data for persisting to DB
         * @param data
         */
        function prepareBudgetTransactions(data) {
            data.budgetTransactions = [];
            _.each(vm.giveScholarships, function (scholarship) {

                // Transaction data
                var transaction = {
                    isIncome: false,
                    amount: scholarship.amount,
                    description: 'ให้ทุนแก่นิสิต',
                    SubBudgetId: scholarship.SubBudgetId
                };
                data.budgetTransactions.push(transaction);
            });
        }

        function calculateAvgScore() {
            vm.avgScore1 = 0;
            vm.avgScore2 = 0;
            vm.avgScore3 = 0;
            vm.avgScore4 = 0;
            vm.avgScore5 = 0;
            vm.avgAllScore = 0;
            vm.gotScholarship = 0;

            // Do calculation only the vm.evaluations isn't empty
            if (vm.evaluations.length) {
                angular.forEach(vm.evaluations, function (evaluation) {
                    vm.avgScore1 += evaluation.score1;
                    vm.avgScore2 += evaluation.score2;
                    vm.avgScore3 += evaluation.score3;
                    vm.avgScore4 += evaluation.score4;
                    vm.avgScore5 += evaluation.score5;
                    vm.avgAllScore += evaluation.score1 + evaluation.score2 + evaluation.score3 + evaluation.score4 + evaluation.score5;
                    if (evaluation.getScholarship)
                        vm.gotScholarship += 1;
                });
                vm.avgScore1 /= vm.evaluations.length;
                vm.avgScore2 /= vm.evaluations.length;
                vm.avgScore3 /= vm.evaluations.length;
                vm.avgScore4 /= vm.evaluations.length;
                vm.avgScore5 /= vm.evaluations.length;
                vm.avgAllScore /= vm.evaluations.length;
            }
        }

        /**
         * Export a PDF file of a student
         */
        function exportPdf() {
            var data = {},
                newWindow;

            // Set student's id in order to be used to
            // query the student application and create a Pdf
            data.StudentId = $routeParams.StudentId;
            data.AcademicYearId = $routeParams.AcademicYearId;

            // This is important, the window.open object should be created
            // before entering the $ajax call, if not, the new window will be
            // block by a browser. Basically, it's tell the browser that
            // the request comes from a user.
            newWindow = $window.open();

            // If it's success, redirect to create a Pdf
            Reports.saveStudentIdAcademicYearId(data).success(function () {
                newWindow.location = '/reports/application.pdf';
            });
        }

        function exportFile(file) {
            // Set the primary key of the file in order to be used to
            // query and export it
            var data = {},
                newWindow;
            data.primaryKeyId = file.id;

            // This is important, the window.open object should be created
            // before entering the $ajax call, if not, the new window will be
            // block by a browser. Basically, it's tell the browser that
            // the request comes from a user. 
            newWindow = $window.open();

            // If it's success, redirect to create a Pdf
            Scholarships.savePrimaryKeyId(data).success(function () {
                newWindow.location = '/scholarships/export/' + file.File.name + '.' + file.mimetype.split('/')[1];
            });
        }

        // Add a scholarship field
        function addGiveScholarship() {
            vm.giveScholarships.push({});
        }

        // Delete a scholarship field
        function deleteGiveScholarship(index) {
            vm.giveScholarships.splice(index, 1);
        }
    }
})();
