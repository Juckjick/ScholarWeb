(function () {
    'use strict';

    angular
        .module('sms.roles')
        .controller('RolesController', Roles);

    Roles.$inject = ['$scope', '$modal', '$http', '$timeout', '$anchorScroll', '$location', '$validation'];

    function Roles($scope, $modal, $http, $timeout, $anchorScroll, $location, $validation) {
        var vm = this;

        /**
         * Variables
         */
        vm.newRole = {};
        vm.newRole.subSystems = [];
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        /**
         * Funcitons
         */
        vm.calculateStartEndPage = calculateStartEndPage;
        vm.toggleRight = toggleRight;
        vm.create = create;
        vm.edit = edit;
        vm.del = del;
        vm.openEditModal = openEditModal;
        vm.cancelEdit = cancelEdit;
        vm.openDeleteModal = openDeleteModal;
        vm.cancelDelete = cancelDelete;

        init();

        function init() {
            // Load systems joined with subsystems
            $http.post('/api/systems/load').success(function (systems) {
                vm.systems = systems;
            });

            // Load roles joined with subsystems
            $http.post('/api/roles/load-subsystems').success(function (roles) {
                vm.roles = roles;
                initPagination();
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
            // roles array length if the end page
            // is greater than roles array length
            if (vm.endPage > vm.roles.length)
                vm.endPage = vm.roles.length;
        }


        // Toggle a sub-system in the newRole.subSystems list
        function toggleRight(role, subSystemId) {
            var index = role.subSystems.indexOf(subSystemId);
            // If the systemId didn't already exist
            if (index === -1) {
                role.subSystems.push(subSystemId);
            }
            // If it's already exist in the list, just delete it
            else {
                role.subSystems.splice(index, 1);
            }
        }

        // Add new role
        function create() {
            vm.isSubmit = true;
            $http.post('/api/roles/create', vm.newRole).success(function () {
                // Show successful message, scroll to the top of the page, reset all the form fields
                vm.isSuccess = true;

                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $localtion.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                $timeout(function () {
                    vm.isSuccess = false;
                    $validation.reset(vm.form);
                    vm.isSubmit = false;
                }, 5000);
            }).error(function (err) {
                vm.isError = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $localtion.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);
            });
        }

        // Edit a role
        function edit() {
            vm.isSubmit = true;
            $http.post('/api/roles/edit', vm.editRole).success(function () {
                // Show successful message, scroll to the top of the page
                vm.isSuccess = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $localtion.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                // Load roles joined with subsystems
                $http.post('/api/roles/load-subsystems').success(function (roles) {
                    vm.roles = roles;
                    $timeout(function () {
                        vm.editModal.close();
                        vm.isSuccess = false;
                        vm.isSubmit = false;
                    }, 3000);
                });
            }).error(function (err) {
                vm.isError = true;
                // Scroll to #top, and then reset the route back to normal,
                // without #top, by setting $localtion.hash(null)
                $location.hash('top');
                $anchorScroll();
                $location.hash(null);

                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);
            });
        }

        // Role edit modal
        function openEditModal(role) {
            vm.editRole = angular.copy(role);
            vm.editRole.subSystems = [];
            // Create a subSystem array
            angular.forEach(vm.editRole.SubSystems, function (eachSubSystem) {
                vm.toggleRight(vm.editRole, eachSubSystem.id);
            });

            // Open edit modal
            vm.editModal = $modal.open({
                templateUrl: 'partials/roles/public/views/roles.edit.view',
                scope: $scope
            });
        }


        // Cancel edit modal
        function cancelEdit() {
            vm.editModal.dismiss('cancel');
        }

        // Delete a role
        function del() {
            vm.isSubmit = true;
            $http.post('/api/roles/delete', vm.deleteRole).success(function () {
                for (var i = 0; i < vm.roles.length; i++) {
                    if (vm.roles[i].id === vm.deleteRole.id) {
                        vm.roles.splice(i, 1);
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
        function openDeleteModal(role) {
            vm.deleteRole = role;
            vm.deleteModal = $modal.open({
                templateUrl: 'partials/roles/public/views/roles.delete-modal.view',
                scope: $scope
            });
        }

        // Cancel delete modal
        function cancelDelete() {
            vm.deleteModal.dismiss('cancel');
        }
    }
})();
