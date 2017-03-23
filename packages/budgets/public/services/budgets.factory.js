(function() {
    'use strict';

    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.budgets')
        .factory("Budgets", Budgets);

    Budgets.$inject = ['Global', '$http'];

    function Budgets(Global, $http) {
        var budgetFactory = {};

        /**
         * Functions
         */
        budgetFactory.load = load;
        budgetFactory.loadMainSub = loadMainSub;
        budgetFactory.loadMainSubBudgetOfCurrentAcademicYear = loadMainSubBudgetOfCurrentAcademicYear;
        budgetFactory.upsert = upsert;
        budgetFactory.del = del;

        return budgetFactory;

        /**
         * Load data from DB
         * @return {Promise} of budgets
         */
        function load(name) {
            return $http.post('/api/budgets/load/' + name);
        }

        function loadMainSub() {
            return $http.post('/api/budgets/load/main-sub-budgets');
        }

        function loadMainSubBudgetOfCurrentAcademicYear() {
            return $http.post('/api/budgets/load/main-sub-budgets/current-academicyear');
        }

        function upsert(data) {
            return $http.post('/api/budgets/upsert', data);
        }

        function del(data) {
            return $http.post('/api/budgets/delete', data);
        }

    }
})();
