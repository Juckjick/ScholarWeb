(function() {
    'use strict';

    angular
        .module('sms')
        .controller('SidebarController', Sidebar);

    Sidebar.$inject = ['$scope', 'Global', 'Menus'];

    function Sidebar($scope, Global, Menus) {

        $scope.global = Global;
        // Menus and Submenus
        $scope.subMenus = Menus.getSubMenus();
        $scope.isCollapsed = false;

        // In case the parent menu is clicked once again
        $scope.$watch(function() {
            return Menus.getMenuId();
        }, function(newMenuId, oldMenuId) {
            $scope.subMenus = Menus.getSubMenus();
        });
    }
})();
