(function () {
    'use strict';

    angular
        .module('sms.reports')
        .controller('ReportsStudentController', ReportsStudent);

    ReportsStudent.$inject = ['$window', '$modal', '$scope', 'Reports'];

    function ReportsStudent($window, $modal, $scope, Reports) {
        var vm = this;

        /**
         * Variables
         */
        vm.students = [];
        vm.itemsByPage = 10;
        vm.startPage = 1;
        vm.endPage = 10;

        /**
         * Functions
         */
        vm.calculateStartEndPage = calculateStartEndPage;
        vm.exportPdf = exportPdf;
        vm.openDetailModal = openDetailModal;
        vm.cancelDetailModal = cancelDetailModal;

        init();

        function init() {
            // Load all students' profiles from database
            // who have applied a scholarship 
            Reports.loadAllStudents().success(function (students) {
                vm.students = students || [];

                initPagination();
            });
        }

        /**
         * Initialize pagination
         */
        function initPagination() {
            // Set number of end page equals to
            // students array length if the end page
            // is greater than students array length
            if (vm.endPage > vm.students.length)
                vm.endPage = vm.students.length;
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
         * Export a PDF file of a student
         */
        function exportPdf() {
            // Set student's id and AcademicYearId in order to be used to 
            // query the student application and create a Pdf
            var data = {},
                newWindow;
            data.StudentId = vm.profiles[0].UserId;
            data.AcademicYearId = vm.AcademicYearId;

            // This is important, the window.open object should be created
            // before entering the $ajax call, if not, the new window will be
            // block by a browser. Basically, it's tell the browser that
            // the request comes from a user. 
            newWindow = $window.open();

            // If it's success, redirect to create a Pdf
            Reports.saveStudentIdAcademicYearId(data).success(function () {
                newWindow.location = '/reports/application.pdf';
                vm.detailModal.close();
            });
        }

        // Detail modal 
        function openDetailModal(UserId) {
            var data = {};
            data.UserId = UserId;
            // Get all information about this user,
            // including his/her application AcademicYear
            Reports.loadStudentProfiles(data).success(function (profiles) {
                vm.profiles = profiles || [];
                vm.AcademicYears = [];

                // Get all application AcademicYear
                angular.forEach(profiles, function (profile) {
                    vm.AcademicYears.push(profile.AcademicYear);
                });

                // Open edit modal
                vm.detailModal = $modal.open({
                    templateUrl: 'partials/reports/public/views/reports.student-profile.view',
                    scope: $scope
                });

            });

        }


        // Cancel edit modal
        function cancelDetailModal() {
            vm.detailModal.dismiss('cancel');
        }

    }

})();
