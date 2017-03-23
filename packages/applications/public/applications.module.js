(function () {
    "use strict";

    angular.module('sms.applications', [])
        .config(['$validationProvider', function ($validationProvider) {
            $validationProvider.showSuccessMessage = false;
            $validationProvider.setErrorHTML(function (msg) {
                // remember to return your HTML
                return '<span class="control-label has-error">' + msg + '</span>';
            });
        }]);
})();