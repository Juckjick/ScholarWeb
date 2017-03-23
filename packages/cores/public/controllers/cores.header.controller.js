(function() {
    'use strict';

    angular
        .module('sms')
        .controller('HeaderController', Header);

    Header.$inject = ['$scope', 'Global', 'Menus'];

    function Header($scope, Global, Menus) {

        /**
         * Variables
         */
        $scope.global = Global;
        $scope.setMenuId = setMenuId;
        $scope.isCollapsed = false;

        // Menus and Submenus
        Menus.getMenus(function(err, menus) {
            $scope.menus = menus;
        });

        function setMenuId(menuId) {
            Menus.setMenuId(menuId);
        }

    }
})();
