(function() {
    'use strict';

    /**
     * Convert year to buddhist calendar by using moment.js
     * @see http://momentjs.com/
     */
    angular
        .module('sms')
        .filter('buddhistYear', buddhistYear);

    function buddhistYear() {
        return function(date) {
            if (date)
                return moment(date).add(543, 'years').toDate();
        };
    }
})();
