(function() {
    'use strict';

    angular
        .module('sms.budgets')
        .controller('BudgetsGraphController', BudgetsGraph);

    BudgetsGraph.$inject = ['Budgets', 'Transactions', 'AcademicYear'];

    function BudgetsGraph(Budgets, Transactions, AcademicYear) {
        var vm = this;

        /**
         * Variables
         */
        vm.filter = {};
        // Graph types
        vm.graphs = [];


        /**
         * Functions
         */
        vm.find = find;
        vm.filterBudgets = filterBudgets;
        vm.filterSubBudgets = filterSubBudgets;
        vm.openStartDate = openStartDate;
        vm.openEndDate = openEndDate;

        init();



        function init() {

            // Load academic year
            AcademicYear.load().success(function(ays) {
                vm.AcademicYears = ays || [];

                // Unshift a "ทั้งหมด" option
                vm.AcademicYears.unshift({
                    name: 'ทั้งหมด',
                    value: 0
                });
            });

            // Get main budgets joined with sub budgets
            Budgets.loadMainSub().success(function(budgets) {
                vm.budgets = budgets || [];
                // Unshift a "ทั้งหมด" option
                vm.budgets.unshift({
                    name: 'ทั้งหมด',
                    value: 0,
                    SubBudgets: []
                });

                // Unshift a "ทั้งหมด" option into all subbudgets
                angular.forEach(vm.budgets, function(budget) {
                    budget.SubBudgets.unshift({
                        name: 'ทั้งหมด',
                        value: 0
                    });
                });
            });


            // Graph types
            vm.graphs.push({
                name: 'แผนภูมิวงกลม',
                type: 'pie'
            });
            vm.graphs.push({
                name: 'กราฟแท่ง',
                type: 'bar'
            });
            vm.graphs.push({
                name: 'กราฟเส้น',
                type: 'line'
            });
            vm.graphs.push({
                name: 'แผนภูมิจุด',
                type: 'point'
            });
            vm.graphs.push({
                name: 'แผนภูมิพื้นที่',
                type: 'area'
            });

            // Default filter.graphType is pie
            vm.filter.graphType = 'pie';

            // Config graph properties
            configGraph();
        }

        /**
         * Config all graph properties
         */
        function configGraph() {
            vm.graphConfig = {
                tooltips: true,
                labels: false,
                mouseover: function() {},
                mouseout: function() {},
                click: function() {},
                legend: {
                    display: true,
                    //could be 'left, right'
                    position: 'right'
                },
                colors: ['#337AB7', '#5CB85C', '#D9534F'],
                innerRadius: 100,
                isAnimate: true,
                xAxisRotation: -65
            };

            // Angular chart config
            vm.graphInfo = {
                series: ['คงเหลือ', 'รายรับ', 'รายจ่าย'],
                data: []
            };

        }

        function filterBudgets(Budget) {
            if (vm.filter.AcademicYear)
                return (Budget.AcademicYearId === vm.filter.AcademicYear.id) || (Budget.AcademicYearId === undefined);
        }

        /**
         * Show only sub budgets of the selected main budget
         */
        function filterSubBudgets() {
            angular.forEach(vm.budgets, function(budget) {
                if (budget.id === vm.filter.Budget.id) {

                    // Set new subBudgets of the selected main budget
                    vm.subBudgets = budget.SubBudgets;

                    // Reset vm.filter.SubBudget
                    vm.filter.SubBudget = null;
                }
            });
        }

        /**
         * Open Date picker
         */
        function openStartDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedStartDate = true;
        }

        /**
         * Close Date picker
         */
        function openEndDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedEndDate = true;
        }

        /**
         * Regenerate graphData
         */
        function find() {
            var results = [],
                data = {};

            // Empty the graphInfo.data
            vm.graphInfo.data = [];

            data.startDate = vm.filter.startDate;
            data.endDate = vm.filter.endDate;

            // Date will be late one day, so, we need to add a day back to it
            if (data.startDate)
                data.startDate = moment(data.startDate).add(1, 'days');
            if (data.endDate)
                data.endDate = moment(data.endDate).add(1, 'days');

            // If AcademicYear.id, BudgetId, and SubBudgetId are 0, filter AcademicYear.Id
            if (!vm.filter.AcademicYear.id && !vm.filter.Budget.id && !vm.filter.SubBudget.id) {
                // Set a title of the graph
                vm.graphConfig.title = 'งบประมาณแต่ละปีการศึกษา';

                Transactions.findGraphDataGroupByAcademicYearId(data).success(function(results) {
                    angular.forEach(results, function(result) {
                        addGraphData(result);
                    });
                });

            }
            // If AcademicYear.id isn't 0 and BudgetId, SubBudgetId are 0, filter BudgetId
            else if (vm.filter.AcademicYear.id && !vm.filter.Budget.id && !vm.filter.SubBudget.id) {
                // Set a title of the graph
                vm.graphConfig.title = 'งบประมานเงินทุนหลักทั้งหมด ประจำปีการศึกษา' + vm.filter.AcademicYear.name;

                Transactions.findGraphDataGroupByBudgetId(data).success(function(results) {
                    angular.forEach(results, function(result) {
                        // Show only budgets in the selected AcademicYear.id
                        if (result.AcademicYearId === vm.filter.AcademicYear.id) {
                            addGraphData(result);
                        }
                    });
                });
            }

            // If BudgetId isn't 0 and SubBudget is 0, filter based on all SubBudgetId(s)
            else if (vm.filter.Budget.id && !vm.filter.SubBudget.id) {
                // Set a title of the graph
                vm.graphConfig.title = 'งบประมานเงินทุนย่อย';

                Transactions.findGraphDataGroupBySubBudgetId(data).success(function(results) {
                    angular.forEach(results, function(result) {
                        // Show only subbudgets in the selected BudgetId
                        if (result.BudgetId === vm.filter.Budget.id) {
                            addGraphData(result);
                        }
                    });
                });

            }

            // If BudgetId and SubBudgetId aren't 0, filter based on the chosen SubBudgetId
            else if (vm.filter.Budget.id && vm.filter.SubBudget.id) {
                // Set a title of the graph
                vm.graphConfig.title = 'งบประมานเงินทุนย่อย';

                results = Transactions.findGraphDataGroupBySubBudgetId(data).success(function(results) {
                    angular.forEach(results, function(result) {
                        // Show only the selected SubBudgetId
                        if (result.SubBudgetId === vm.filter.SubBudget.id) {
                            addGraphData(result);
                        }
                    });

                });
            }

        }

        function addGraphData(result) {
            vm.graphInfo.data.push({
                x: result.name,
                y: [
                    result.balance || 0,
                    result.revenue || 0,
                    result.expense || 0
                ]
            });
        }

    }
})();
