(function () {
    'use strict';

    /**
     * Exception Factory
     */
    angular
        .module('sms')
        .factory('Exception', Exception);

    Exception.$inject = ['$timeout'];

    function Exception($timeout) {
        var exceptionFac = {
            successHandler: successHandler,
            errorHandler: errorHandler
        };

        return exceptionFac;


        /**
         * Success catcher for handling a success status
         * @param  {Object}   vm   of a view model
         * @param  {Integer}   time in milliseconds to close the modal
         * @param  {Function} callback
         * @return {Function} handler
         */
        function successHandler(vm, time, callback) {
            return function (data) {
                vm.isSuccess = true;
                $timeout(function () {
                    vm.isSuccess = false;
                    vm.isSubmitted = false;
                    if (callback) callback(data);
                }, time || 5000);
            };
        }

        /**
         * Error catcher for handling an error status
         * @param  {Object}   vm   of a view model
         * @param  {Integer}   time in milliseconds to close the modal
         * @param  {Function} callback
         * @return {Function} handler
         */
        function errorHandler(vm, time, callback) {
            return function (err) {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmitted = false;
                    if (callback) callback();
                }, time || 5000);

            };
        }
    }
})();
