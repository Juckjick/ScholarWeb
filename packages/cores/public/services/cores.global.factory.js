(function() {
    'use strict';

    //Global service for global variables
    angular
        .module('sms')
        .factory("Global", Global);

    function Global() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !!window.user
        };

        return _this._data;
    }
})();
