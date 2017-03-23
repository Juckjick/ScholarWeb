(function () {
    'use strict';

    angular
        .module('sms.budgets')
        .controller('BudgetsTransactionController', BudgetsTransaction);

    BudgetsTransaction.$inject = ['$timeout', '$validation', 'Budgets', 'Transactions', 'AcademicYear'];

    function BudgetsTransaction($timeout, $validation, Budgets, Transactions, AcademicYear) {
        var vm = this;

        /**
         * Variables
         */
        vm.result = {};
        vm.subBudget = {};
        vm.incomeOptions = [{
            name: 'เพิ่ม',
            value: true
        }, {
            name: 'ลด',
            value: false
        }];

        /**
         * Functions
         */
        vm.filterSubBudgets = filterSubBudgets;
        vm.save = save;

        init();

        function init() {
            // Get main budgets joined with sub budgets
            Budgets.loadMainSub().success(function (budgets) {
                vm.budgets = budgets || [];
            });

            // Load academic year
            AcademicYear.load().success(function (ays) {
                vm.AcademicYears = ays || [];
            });
        }

        /**
         * Show only sub budgets of the selected main budget
         */
        function filterSubBudgets() {
            angular.forEach(vm.budgets, function (budget) {
                if (budget.id === vm.result.Budget.id)
                    vm.subBudgets = budget.SubBudgets;
            });
        }

        /**
         * Save a new transaction to DB
         */
        function save() {
            var data = {};

            vm.isSubmit = true;

            // Setting a transaction properties
            data.transaction = vm.result;
            data.transaction.SubBudgetId = vm.result.SubBudget.id;

            // Clone the SubBudget object
            data.SubBudget = angular.copy(vm.result.SubBudget);
            // Increase a balance of the SubBudget
            if (vm.result.isIncome)
                data.SubBudget.balance += vm.result.amount;
            else
                data.SubBudget.balance -= vm.result.amount;

            // A new balance can't lesser than 0
            if (data.SubBudget.balance < 0) {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);
                return;
            } else {
                // Set a subBudget.balance to a new balance
                vm.subBudget.balance = vm.result.newBalance;
            }

            Transactions.create(data).success(function () {
                vm.isSuccess = true;
                // Reload SubBudget to get the updated balance
                Budgets.loadMainSub().success(function (budgets) {
                    vm.budgets = budgets || [];
                    $timeout(function () {
                        $validation.reset(vm.form);
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
    }
})();
