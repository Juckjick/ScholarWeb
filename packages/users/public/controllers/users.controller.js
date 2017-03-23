(function () {
    'use strict';

    angular
        .module('sms.users')
        .controller('UsersController', UsersCtrl);

    UsersCtrl.$inject = ['$scope', '$modal', '$http', '$timeout', '$validation', '$anchorScroll', '$location', 'Users'];

    function UsersCtrl($scope, $modal, $http, $timeout, $validation, $anchorScroll, $location, Users) {
        var vm = this;

        /**
         * Variables
         */
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        /**
         * Functions
         */
        vm.calculateStartEndPage = calculateStartEndPage;
        vm.openStartDate = openStartDate;
        vm.openEndDate = openEndDate;
        vm.create = create;
        vm.edit = edit;
        vm.del = del;
        vm.openEditModal = openEditModal;
        vm.cancelEdit = cancelEdit;
        vm.openDeleteModal = openDeleteModal;
        vm.cancelDelete = cancelDelete;

        init();

        function init() {
            //Load all users joined with roles
            $http.post('/api/users/load-roles').success(function (users) {
                vm.users = users;

                initPagination();
            });
            // Load roles
            $http.post('/api/roles/load').success(function (roles) {
                vm.roles = roles;
            });
        }

        /**
         * Change the start/end page
         * @param newPage is a new page number
         */
        function calculateStartEndPage(newPage) {
            vm.startPage = ((newPage - 1) * vm.itemsByPage) + 1;
            vm.endPage = newPage * vm.itemsByPage;

            initPagination();
        }

        /**
         * Initialize pagination
         */
        function initPagination() {
            // Set number of end page equals to
            // users array length if the end page
            // is greater than users array length
            if (vm.endPage > vm.users.length)
                vm.endPage = vm.users.length;
        }

        // Date picker
        function openStartDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedStartDate = true;
        }

        function openEndDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedEndDate = true;
        }

        // Create a new user
        function create() {
            console.log("--");
            vm.isSubmit = true;

            $http.post('/api/users/create', vm.newUser).success(function (user) {
                vm.isSuccess = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $location.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                $timeout(function () {
                    vm.isSuccess = false;
                    vm.newUser = {}; // To delete optional field
                    $validation.reset(vm.form);
                    vm.isSubmit = false;
                }, 5000);
            }).error(function (err) {
                vm.isError = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $location.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);
            });
        }

        // Edit a user
        function edit() {
            vm.isSubmit = true;
            Users.edit(vm.editUser).success(function () {
                vm.isSuccess = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $location.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                //Reload all users' information joined with roles
                $http.post('/api/users/load-roles').success(function (users) {
                    vm.users = users;

                    $timeout(function () {
                        vm.isSuccess = false;
                        vm.isSubmit = false;
                        vm.editModal.close();
                    }, 3000);
                });
            }).error(function (err) {
                vm.isError = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $location.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);

            });
        }

        // User edit modal
        function openEditModal(user) {
            vm.editUser = angular.copy(user);
            vm.editModal = $modal.open({
                templateUrl: 'partials/users/public/views/users.edit.view',
                scope: $scope
            });
        }

        // Cancel edit modal
        function cancelEdit() {
            vm.editModal.dismiss('cancel');
        }

        // Delete a user
        function del() {
            vm.isSubmit = true;
            $http.post('/api/users/delete', vm.deleteUser).success(function () {
                for (var i = 0; i < vm.users.length; i++) {
                    if (vm.users[i].id === vm.deleteUser.id) {
                        vm.users.splice(i, 1);
                    }
                }
                // Show successful message, scroll to the top of the page
                vm.isSuccess = true;

                $timeout(function () {
                    vm.deleteModal.close();
                    vm.isSuccess = false;
                    vm.isSubmit = false;
                }, 3000);
            }).error(function () {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);
            });
        }

        // Confirmation modal
        function openDeleteModal(user) {
            vm.deleteUser = user;
            vm.deleteModal = $modal.open({
                templateUrl: 'partials/users/public/views/users.delete-modal.view',
                scope: $scope
            });
        }

        // Cancel delete modal
        function cancelDelete() {
            vm.deleteModal.dismiss('cancel');
        }
    }
})();
