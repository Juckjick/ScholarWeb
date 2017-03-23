(function() {
    'use strict';

    angular
        .module('sms')
        .controller('IndexController', Index);

    Index.$inject = ['Global', 'Menus'];

    function Index(Global, Menus) {

        var vm = this;

        /**
         * Get a title of the current menu
         */
        vm.currentMainMenu = Menus.getCurrentMainMenu();
    }

})();
