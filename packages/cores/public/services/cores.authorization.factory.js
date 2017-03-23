(function() {
    'use strict';

    /**
     * Authorization Factory
     */
    angular
        .module('sms')
        .factory('Authorization', Authorization);

    Authorization.$inject = ['$http', '$window', '$location', '$q', 'Interviews'];

    function Authorization($http, $window, $location, $q, Interviews) {
        var authFactory = {};

        /**
         * Functions
         */
        authFactory.verifyAuthorization = verifyAuthorization;
        authFactory.verifyAlreadyApplied = verifyAlreadyApplied;
        authFactory.verifyIsScholarshipOpen = verifyIsScholarshipOpen;

        return authFactory;


        /**
         * Verify whether a user has
         * a given authorization or not by SubSystemId
         * @param  {Integer} SubSystemId
         * @return {Promise} authorization
         */
        function verifyAuthorization(link) {
            var data = {};
            data.link = link;
            return $http.post('/api/authorization/verify', data).error(function() {
                // If the user isn't authorized, redirect to 403 page
                $window.location.href = '/403?type=authorization';
            });
        }

        /**
         * Verify whether the current user has already applied
         * a scholarship for this year or not
         * @param  {Integer} StudentId
         * @return {Promise} defer
         */
        function verifyAlreadyApplied(StudentId) {
            var defer = $q.defer();
            // Get a current scholarship setting
            $http.post('/api/scholarships/load/setting').success(function(setting) {
                // Get all scholarship applications
                Interviews.loadStudents().success(function(applications) {
                    angular.forEach(applications, function(application) {
                        if (application.UserId === StudentId && setting.AcademicYearId === application.AcademicYearId) {
                            $location.path('/scholarships/apply/complete');
                            defer.reject();
                        }
                    });
                    defer.resolve();
                });
            });
            return defer.promise;
        }

        /**
         * Verify whether the current date is between
         * the scholarship setting startDate and endDate or not
         * @param  {Integer} StudentId
         * @return {Promise} defer
         */
        function verifyIsScholarshipOpen(StudentId) {
            // Get a current scholarship setting
            return $http.post('/api/authorization/isscholarshipopen').success(function(setting) {
                if (!setting)
                    $window.location.href = '/403?type=scholarship';
            });
        }
    }
})();
