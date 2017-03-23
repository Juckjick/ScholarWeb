(function() {
    'use strict';
    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.settings')
        .factory("AcademicYear", AcademicYear);

    AcademicYear.$inject = ['$http'];

    function AcademicYear($http) {
        var ayFactory = {};

        ayFactory.load = load;
        ayFactory.upsert = upsert;
        ayFactory.del = del;

        return ayFactory;

        /**
         * Load data from DB
         * @return {Promise} of academicyear
         */
        function load() {
            return $http.post('/api/settings/academicyear/load');
        }

        function upsert(data) {
            return $http.post('/api/settings/academicyear/upsert', data);
        }

        function del(data) {
            return $http.post('/api/settings/academicyear/delete', data);
        }

    }

})();
