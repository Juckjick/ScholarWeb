(function() {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipSettingsController', ScholarshipSettings);

    ScholarshipSettings.$inject = ['$scope', 'Global', '$modal', '$http', '$timeout', '$filter', 'AcademicYear'];

    function ScholarshipSettings($scope, Global, $modal, $http, $timeout, $filter, AcademicYear) {
        var vm = this;

        vm.setting = {};

        /**
         * Functions
         */
        vm.openStartDate = openStartDate;
        vm.openEndDate = openEndDate;
        vm.upsertSetting = upsertSetting;

        init();

        function init() {
            // Load setting from DB
            $http.post('/api/scholarships/load/setting').success(function(setting) {
                vm.setting = setting || {};
            });

            // Load academic year
            AcademicYear.load().success(function(ays) {
                vm.AcademicYears = ays || [];
            });
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

        function upsertSetting() {
            vm.isSubmit = true;
            // Verify whether it has a value or not
            if (!!vm.setting.startDate && !!vm.setting.endDate) {
                var data = {};
                data.setting = vm.setting;
                $http.post('/api/scholarships/upsert/setting', data).success(function() {
                    vm.isSuccess = true;
                    $timeout(function() {
                        vm.isSuccess = false;
                    }, 5000);
                }).error(function(err) {
                    vm.isError = true;
                    $timeout(function() {
                        vm.isError = false;
                    }, 5000);
                });
            }
        }
    }
})();
