(function() {
    'use strict';

    angular
        .module('sms.budgets')
        .controller('BudgetsSubController', BudgetsSub);

    BudgetsSub.$inject = ['$scope', '$modal', '$timeout', '$validation', 'Budgets', 'AcademicYear'];
    function BudgetsSub($scope, $modal, $timeout, $validation, Budgets, AcademicYear) {
        var vm = this;

        /**
         * Variables
         */
        vm.newBudget = {};
        vm.editBudget = {};
        vm.budgets = [];
        vm.mainBudgets = [];
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        /**
         * Functions
         */
        vm.calculateStartEndPage = calculateStartEndPage;
        vm.create = create;
        vm.edit = edit;
        vm.del = del;
        vm.openEditModal = openEditModal;
        vm.cancelEditModal = cancelEditModal;
        vm.openDeleteModal = openDeleteModal;
        vm.cancelDeleteModal = cancelDeleteModal;

        init();

        function init() {
            // Load all main budgets from DB
            Budgets.load('main-budgets').success(function(budgets) {
                vm.mainBudgets = budgets || [];
            });

            // Load sub budget from DB
            Budgets.load('sub-budgets').success(function(budgets) {
                vm.budgets = budgets || [];
                initPagination();
            });

            // Load academic year
            AcademicYear.load().success(function(ays) {
                vm.AcademicYears = ays || [];
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
            // budgets array length if the end page
            // is greater than budgets array length
            if (vm.endPage > vm.budgets.length)
                vm.endPage = vm.budgets.length;
        }

        /**
         * Create a new main budget
         */
        function create() {
            vm.isSubmit = true;
            var data = {};
            data.budget = vm.newBudget;
            data.dbName = 'SubBudget';
            Budgets.upsert(data).success(function() {
                vm.isSuccess = true;
                $timeout(function() {
                    vm.isSuccess = false;
                    $validation.reset(vm.form);
                    vm.isSubmit = false;
                }, 5000);
            }).error(function(err) {
                vm.isError = true;
                $timeout(function() {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);
            });
        }

        /**
         * Edit an exist budget
         */
        function edit() {
            vm.isSubmit = true;
            var data = {};
            data.budget = vm.editBudget;
            data.dbName = 'SubBudget';
            Budgets.upsert(data).success(function() {
                vm.isSuccess = true;
                // Load sub budget from DB
                Budgets.load('sub-budgets').success(function(budgets) {
                    vm.budgets = budgets;
                    $timeout(function() {
                        vm.isSuccess = false;
                        vm.editModal.close();
                        vm.isSubmit = false;
                    }, 3000);
                });
            }).error(function(err) {
                vm.isError = true;
                $timeout(function() {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);
            });
        }

        /**
         * Delete a budget
         */
        function del() {
            var data = {};
            vm.isSubmit = true;

            data.budget = vm.deleteBudget;
            data.dbName = 'SubBudget';
            Budgets.del(data).success(function() {
                vm.isSuccess = true;

                // Delete form budgets array
                for (var i = 0; i < vm.budgets.length; i++) {
                    if (vm.budgets[i].id === vm.deleteBudget.id) {
                        vm.budgets.splice(i, 1);
                    }
                }

                $timeout(function() {
                    vm.isSuccess = false;
                    vm.deleteModal.close();
                    vm.isSubmit = false;
                }, 3000);
            }).error(function(err) {
                vm.isError = true;
                $timeout(function() {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);
            });
        }

        /**
         * Open a edit modal of a budget
         */
        function openEditModal(budget) {
            vm.editBudget = budget;
            vm.editModal = $modal.open({
                templateUrl: 'partials/budgets/public/views/subs/budgets.subs.edit.view',
                scope: $scope
            });
        }

        /**
         * Cancel a edit modal of a budget
         */
        function cancelEditModal() {
            vm.editModal.dismiss('cancel');
        }

        /**
         * Open a delete modal of budget
         */
        function openDeleteModal(budget) {
            vm.deleteBudget = budget;
            vm.deleteModal = $modal.open({
                templateUrl: 'partials/budgets/public/views/subs/budgets.subs.delete.view',
                scope: $scope
            });
        }

        function cancelDeleteModal() {
            vm.deleteModal.dismiss('cancel');
        }

    }

})();
