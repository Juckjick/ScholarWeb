(function() {
    'use strict';

    angular
        .module('sms.reports')
        .controller('ReportsScholarshipController', ReportsScholarship);

    ReportsScholarship.$inject = ['$window', 'Global', 'Reports', 'AcademicYear'];
    function ReportsScholarship($window, Global, Reports, AcademicYear) {
        var vm = this;

        /**
         * Variables
         */
        vm.filter = {};

        /**
         * Functions
         */
         vm.openStartDate = openStartDate;
         vm.openEndDate = openEndDate;
         vm.find = find;
         vm.exportToExcel = exportToExcel;

        init();

        function init() {
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

        function find() {
            var data = {};

            data.startDate = vm.filter.startDate;
            data.endDate = vm.filter.endDate;
            data.AcademicYear = vm.filter.AcademicYear;

            // Date will be late one day, so, we need to add a day back to it
            if (data.startDate)
                data.startDate = moment(data.startDate).add(1, 'days');
            if (data.endDate)
                data.endDate = moment(data.endDate).add(1, 'days');

            Reports.loadScholarship(data).success(function(results) {
                vm.results = results;
            });
        }

        function exportToExcel() {
            $window.open('/reports/scholarship');
        }

    }
})();
