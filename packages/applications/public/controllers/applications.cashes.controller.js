(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsCashController', ScholarshipsCash);

    ScholarshipsCash.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsCash(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this,
            type = {
                1: 'รับเงินค่าอาหาร',
                2: 'รับทุนการศึกษา',
                3: 'รับเงินจากงานพิเศษ',
                4: 'ค่าใช้จ่ายในการรับประทานอาหาร',
                5: 'ค่าใช้จ่ายในการเดินทาง',
                6: 'ค่าใช้จ่ายในการศึกษา'
            };

        /**
         * Variables
         */
        vm.foodIncome = {};
        vm.scholarship = {};
        vm.extra = {};
        vm.foodExpense = {};
        vm.travelling = {};
        vm.education = {};

        /**
         * Functions
         */
        vm.upsertCash = upsertCash;

        init();

        // Initialize data
        function init() {
            vm.foodIncome = Scholarships.getCash(1) || {};
            vm.scholarship = Scholarships.getCash(2) || {};
            vm.extra = Scholarships.getCash(3) || {};
            vm.foodExpense = Scholarships.getCash(4) || {};
            vm.travelling = Scholarships.getCash(5) || {};
            vm.education = Scholarships.getCash(6) || {};
        }

        // Update or insert cashes 
        function upsertCash() {
            var data = {};
            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;
            data.cashes = [];

            vm.isSubmit = true;

            // Bind properties
            vm.foodIncome.typeId = 1;
            vm.foodIncome.typeName = type[1];
            vm.foodIncome.isIncome = true;

            vm.scholarship.typeId = 2;
            vm.scholarship.typeName = type[2];
            vm.scholarship.isIncome = true;

            vm.extra.typeId = 3;
            vm.extra.typeName = type[3];
            vm.extra.isIncome = true;

            vm.foodExpense.typeId = 4;
            vm.foodExpense.typeName = type[4];
            vm.foodExpense.isIncome = false;

            vm.travelling.typeId = 5;
            vm.travelling.typeName = type[5];
            vm.travelling.isIncome = false;

            vm.education.typeId = 6;
            vm.education.typeName = type[6];
            vm.education.isIncome = false;


            // Put all cashes
            data.cashes.push(vm.foodIncome);
            data.cashes.push(vm.scholarship);
            data.cashes.push(vm.extra);
            data.cashes.push(vm.foodExpense);
            data.cashes.push(vm.travelling);
            data.cashes.push(vm.education);

            $http.post('/api/scholarships/upsert/cashes', data).success(function (cashes) {
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
            return $scope.fourth;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
