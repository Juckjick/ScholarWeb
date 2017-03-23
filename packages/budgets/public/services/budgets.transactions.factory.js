(function() {
    'use strict';
    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.budgets')
        .factory("Transactions", Transactions);

    Transactions.$inject = ['Global', '$http'];

    function Transactions(Global, $http) {
        var transactionFactory = {};

        /**
         * Functions
         */
        transactionFactory.create = create;
        transactionFactory.findGraphDataGroupByAcademicYearId = findGraphDataGroupByAcademicYearId;
        transactionFactory.findGraphDataGroupByBudgetId = findGraphDataGroupByBudgetId;
        transactionFactory.findGraphDataGroupBySubBudgetId = findGraphDataGroupBySubBudgetId;
        transactionFactory.findAllBetweenDate = findAllBetweenDate;

        return transactionFactory;

        /**
         * Create a new transaction
         * @param  {Object} data
         * @return {Promise} transaction
         */
        function create(data) {
            return $http.post('/api/budgets/create/transaction', data);
        }

        function findGraphDataGroupByAcademicYearId(data) {
            return $http.post('/api/budgets/load/transaction-graph-academicyear', data);
        }

        function findGraphDataGroupByBudgetId(data) {
            return $http.post('/api/budgets/load/transaction-graph-main', data);
        }

        function findGraphDataGroupBySubBudgetId(data) {
            return $http.post('/api/budgets/load/transaction-graph-sub', data);
        }

        function findAllBetweenDate(data) {
            return $http.post('/api/budgets/load/transaction-table', data);
        }

    }

})();
