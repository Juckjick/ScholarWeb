(function () {
    'use strict';

    angular
        .module('sms.users')
        .factory("Users", Users);

    Users.$inject = ['$http'];

    function Users($http) {
        var userFac = {
            edit: edit,
            updateProfile: updateProfile
        };

        function edit(user) {
            return $http.post('/api/users/edit', user);
        }

        /**
         * Saperate from edit for the sake of authorization
         * @param  {Object} user
         * @return {Promise}
         */
        function updateProfile(user) {
            return $http.post('/api/users/update/profile', user);
        }

        return userFac;

    }

})();
