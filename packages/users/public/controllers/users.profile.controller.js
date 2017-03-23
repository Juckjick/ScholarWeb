(function () {
    'use strict';

    angular
        .module('sms.users')
        .controller('UsersProfileController', UsersProfile);

    UsersProfile.$inject = ['Global', 'Exception', 'Users'];

    function UsersProfile(Global, Exception, Users) {
        var vm = this;

        vm.currentUser = angular.copy(Global.user);
        vm.updateProfile = updateProfile;

        function updateProfile(user) {
            vm.isSubmit = true;
            Users.updateProfile(user)
                .success(Exception.successHandler(vm))
                .error(Exception.errorHandler(vm));
        }

    }
})();
