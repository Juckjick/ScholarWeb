(function() {
    'use strict';

    angular
        .module('sms.budgets')
        .controller('BudgetsTableController', BudgetsTable);

    BudgetsTable.$inject = ['$filter', 'Global', 'Budgets', 'Transactions', 'AcademicYear'];

    function BudgetsTable($filter, Global, Budgets, Transactions, AcademicYear) {
        var vm = this;

        /**
         * Variables
         */
        vm.filter = {};
        vm.grid = {};
        // Graph types
        vm.graphs = [];

        /**
         * Functions
         */
        vm.openStartDate = openStartDate;
        vm.find = find;

        init();

        function init() {
            // Load academic year
            AcademicYear.load().success(function(ays) {
                vm.AcademicYears = ays || [];
            });

            // Generate Grid columns
            vm.grid = {
                paginationPageSizes: [10, 25, 50, 100],
                paginationPageSize: 10,
                columnDefs: [{
                    field: 'ทุนหลัก',
                    width: '15%'
                }, {
                    field: 'ทุนย่อย',
                    width: '15%'
                }, {
                    field: 'รายรับ/รายจ่าย',
                    width: '15%'
                }, {
                    field: 'จำนวนเงิน',
                    cellFilter: 'currency:""',
                    width: '15%'
                }, {
                    field: 'รายละเอียด',
                    width: '30%'
                }, {
                    field: 'วันที่',
                    cellFilter: 'date: "dd/MM/yy"',
                    width: '10%'
                }]
            };

        }

        // Date picker
        function openStartDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedStartDate = true;
        }

        function openEndDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedEndDate = true;
        }

        /**
         * Regenerate tableData
         */
        function find() {
            var results = [],
                data = {};

            data.startDate = vm.filter.startDate;
            data.endDate = vm.filter.endDate;
            // Date will be late one day, so, we need to add a day back to it
            if (data.startDate)
                data.startDate = moment(data.startDate).add(1, 'days');
            if (data.endDate)
                data.endDate = moment(data.endDate).add(1, 'days');

            // Retrieve transaction data from database
            Transactions.findAllBetweenDate(data).success(function(transactions) {
                // Generate Grid data
                vm.grid.data = [];
                angular.forEach(transactions, function(trans) {
                    if (trans.SubBudget.AcademicYearId === vm.filter.AcademicYear.id) {
                        vm.grid.data.push({
                            'ทุนหลัก': trans.SubBudget.Budget.name,
                            'ทุนย่อย': trans.SubBudget.name,
                            'รายรับ/รายจ่าย': trans.isIncome ? 'รับ' : 'จ่าย',
                            'จำนวนเงิน': trans.amount,
                            'รายละเอียด': trans.description,
                            'วันที่': $filter('buddhistYear')(trans.updatedAt)
                        });
                   }
                });

            });

        }
    }
})();
