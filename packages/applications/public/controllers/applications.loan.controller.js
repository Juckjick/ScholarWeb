(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsLoanController', ScholarshipsLoan);

    ScholarshipsLoan.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsLoan(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this,
            type = {
                1: 'กยศ.',
                2: 'กรอ.'
            },
            goal = {
                1: 'ค่าเล่าเรียน',
                2: 'ค่าใช้จ่ายรายเดือน'
            };

        /**
         * Variables
         */
        vm.firstTypeFirstGoal = {};
        vm.firstTypeSecondGoal = {};
        vm.secondTypeFirstGoal = {};
        vm.secondTypeSecondGoal = {};

        // Used for show/hide condition on checkbox
        vm.checkbox = {};
        vm.isDataCorrect = true;

        /**
         * Functions
         */
        vm.upsertLoan = upsertLoan;
        vm.sanitizeLoanCheckbox = sanitizeLoanCheckbox;


        init();

        // Initialize data
        function init() {
            vm.firstTypeFirstGoal = Scholarships.getLoan(1, 1);
            vm.firstTypeSecondGoal = Scholarships.getLoan(1, 2);
            vm.secondTypeFirstGoal = Scholarships.getLoan(2, 1);
            vm.secondTypeSecondGoal = Scholarships.getLoan(2, 2);

            // Default checkbox object
            if (Object.getOwnPropertyNames(vm.firstTypeFirstGoal).length || Object.getOwnPropertyNames(vm.firstTypeSecondGoal).length)
                vm.checkbox.firstType = true;

            if (Object.getOwnPropertyNames(vm.secondTypeFirstGoal).length || Object.getOwnPropertyNames(vm.secondTypeSecondGoal).length)
                vm.checkbox.secondType = true;
        }

        function isCheckboxCorrect() {
            // Checkbox.typeId was checked, but no goalId was checked (2 cases)
            if (vm.checkbox.firstType && (!vm.firstTypeFirstGoal.goalId && !vm.firstTypeSecondGoal.goalId))
                return false;

            if (vm.checkbox.secondType && (!vm.secondTypeFirstGoal.goalId && !vm.secondTypeSecondGoal.goalId))
                return false;

            // GoalId was checked, but no semester was checked (4 cases)
            // If it's correct, add it into the array
            if (vm.firstTypeFirstGoal.goalId && (!vm.firstTypeFirstGoal.firstSemester && !vm.firstTypeFirstGoal.secondSemester))
                return false;
            if (vm.firstTypeSecondGoal.goalId && (!vm.firstTypeSecondGoal.firstSemester && !vm.firstTypeSecondGoal.secondSemester))
                return false;

            if (vm.secondTypeFirstGoal.goalId && (!vm.secondTypeFirstGoal.firstSemester && !vm.secondTypeFirstGoal.secondSemester))
                return false;
            if (vm.secondTypeSecondGoal.goalId && (!vm.secondTypeSecondGoal.firstSemester && !vm.secondTypeSecondGoal.secondSemester))
                return false;

            return true;
        }

        function sanitizeLoanData() {

            var loans = [];

            // Bind other data and add them to array

            vm.isDataCorrect = true;

            if (vm.firstTypeFirstGoal.goalId) {
                vm.firstTypeFirstGoal.typeId = 1;
                vm.firstTypeFirstGoal.typeName = type['1'];
                vm.firstTypeFirstGoal.goalName = goal['1'];
                loans.push(vm.firstTypeFirstGoal);
            }
            if (vm.firstTypeSecondGoal.goalId) {
                vm.firstTypeSecondGoal.typeId = 1;
                vm.firstTypeSecondGoal.typeName = type['1'];
                vm.firstTypeSecondGoal.goalName = goal['2'];
                loans.push(vm.firstTypeSecondGoal);
            }
            if (vm.secondTypeFirstGoal.goalId) {
                vm.secondTypeFirstGoal.typeId = 2;
                vm.secondTypeFirstGoal.typeName = type['2'];
                vm.secondTypeFirstGoal.goalName = goal['1'];
                loans.push(vm.secondTypeFirstGoal);
            }
            if (vm.secondTypeSecondGoal.goalId) {
                vm.secondTypeSecondGoal.typeId = 2;
                vm.secondTypeSecondGoal.typeName = type['2'];
                vm.secondTypeSecondGoal.goalName = goal['2'];
                loans.push((vm.secondTypeSecondGoal));
            }


            return loans;
        }

        // Update or insert loan 
        function upsertLoan() {
            var data = {};
            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.loans = [];

            vm.isSubmit = true;

            if (isCheckboxCorrect()) {
                data.loans = sanitizeLoanData();

                $http.post('/api/scholarships/upsert/loan', data).success(function (loan) {
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
            } else {
                vm.isDataCorrect = false;
                vm.isSubmit = false;
            }
        }

        // Clear out nested checkboxes if the outer checkbox was unchecked
        function sanitizeLoanCheckbox(checkbox) {
            // Checked out type
            if (checkbox === 'firstType') {
                vm.firstTypeFirstGoal = {};
                vm.firstTypeSecondGoal = {};
            } else if (checkbox === 'secondType') {
                vm.secondTypeFirstGoal = {};
                vm.secondTypeSecondGoal = {};
            }

            // Checked out goal
            else if (checkbox === 'firstTypeFirstGoal' && !vm.firstTypeFirstGoal.goalId) {
                vm.firstTypeFirstGoal = {};
            } else if (checkbox === 'firstTypeSecondGoal' && !vm.firstTypeSecondGoal.goalId) {
                vm.firstTypeSecondGoal = {};
            } else if (checkbox === 'secondTypeFirstGoal' && !vm.secondTypeFirstGoal.goalId) {
                vm.secondTypeFirstGoal = {};
            } else if (checkbox === 'secondTypeSecondGoal' && !vm.secondTypeSecondGoal.goalId) {
                vm.secondTypeSecondGoal = {};
            }

        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.tenth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
