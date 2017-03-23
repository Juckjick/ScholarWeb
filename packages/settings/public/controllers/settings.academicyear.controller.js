(function () {
    'use strict';

    angular
        .module('sms.settings')
        .controller('SettingAcademicYearController', SettingAcademicYear);

    SettingAcademicYear.$inject = ['$scope', '$modal', '$timeout', '$validation', 'AcademicYear'];

    function SettingAcademicYear($scope, $modal, $timeout, $validation, AcademicYear) {
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
        vm.upsertAy = upsertAy;
        vm.edit = edit;
        vm.del = del;
        vm.openEditModal = openEditModal;
        vm.cancelEditModal = cancelEditModal;
        vm.openDeleteModal = openDeleteModal;
        vm.cancelDeleteModal = cancelDeleteModal;

        init();

        function init() {
            AcademicYear.load().success(function (data) {
                vm.ayList = data;

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
            // ayList array length if the end page
            // is greater than ayList array length
            if (vm.endPage > vm.ayList.length)
                vm.endPage = vm.ayList.length;
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


        function upsertAy() {
            var data = {};
            vm.isSubmit = true;

            // Verify whether it has a value or not
            if (!!vm.newAy.startDate && !!vm.newAy.endDate) {
                data.ay = vm.newAy;
                AcademicYear.upsert(data).success(function () {
                    vm.isSuccess = true;
                    $timeout(function () {
                        vm.isSuccess = false;
                        vm.isSubmit = false;
                        $validation.reset(vm.form);
                    }, 5000);
                }).error(function (err) {
                    vm.isError = true;
                    $timeout(function () {
                        vm.isError = false;
                        vm.isSubmit = false;
                    }, 5000);
                });
            }
        }

        /**
         * Edit an exist academic year
         */
        function edit() {
            var data = {};

            vm.isSubmit = true;
            if (!!vm.editAy.startDate && !!vm.editAy.endDate) {
                data.ay = vm.editAy;
                AcademicYear.upsert(data).success(function () {
                    vm.isSuccess = true;
                    $timeout(function () {
                        vm.isSuccess = false;
                        vm.editModal.close();
                        vm.isSubmit = false;
                    }, 3000);
                }).error(function (err) {
                    vm.isError = true;
                    $timeout(function () {
                        vm.isError = false;
                        vm.isSubmit = false;
                    }, 3000);
                });
            }
        }

        /**
         * Delete an academic year
         */
        function del() {
            var data = {};
            vm.isSubmit = true;
            data.ay = vm.deleteAy;
            AcademicYear.del(data).success(function () {
                vm.isSuccess = true;
                // Delete form ay array
                for (var i = 0; i < vm.ayList.length; i++) {
                    if (vm.ayList[i].id === vm.deleteAy.id) {
                        vm.ayList.splice(i, 1);
                    }
                }

                $timeout(function () {
                    vm.isSuccess = false;
                    vm.deleteModal.close();
                    vm.isSubmit = false;
                }, 3000);
            }).error(function (err) {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 3000);
            });
        }

        /**
         * Open a edit modal of an academic year
         */
        function openEditModal(ay) {
            vm.editAy = ay;
            vm.editModal = $modal.open({
                templateUrl: 'partials/settings/public/views/academicyears/settings.academicyears.edit.view',
                scope: $scope
            });
        }

        /**
         * Cancel a edit modal of an academic year
         */
        function cancelEditModal() {
            vm.editModal.dismiss('cancel');
        }

        /**
         * Open a delete modal of academic year
         */
        function openDeleteModal(ay) {
            vm.deleteAy = ay;
            vm.deleteModal = $modal.open({
                templateUrl: 'partials/settings/public/views/academicyears/settings.academicyears.delete.view',
                scope: $scope
            });
        }

        function cancelDeleteModal() {
            vm.deleteModal.dismiss('cancel');
        }

    }

})();
