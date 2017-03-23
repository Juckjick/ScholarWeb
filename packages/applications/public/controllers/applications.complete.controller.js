(function() {
    'use strict';
    angular
        .module('sms.applications')
        .controller('ScholarshipsCompleteController', ScholarshipsComplete);

    ScholarshipsComplete.$inject = ['$window', 'Global', 'Reports'];
    function ScholarshipsComplete($window, Global, Reports) {
        var vm = this;

        vm.exportPdf = exportPdf;

        /**
         * Export a PDF file of a student
         */
        function exportPdf() {
            // Set student's id in order to be used to 
            // query the student application and create a Pdf
            var data = {},
                newWindow;
            data.StudentId = Global.user.id;

            // This is important, the window.open object should be created
            // before entering the $ajax call, if not, the new window will be
            // block by a browser. Basically, it's tell the browser that
            // the request comes from a user. 
            newWindow = $window.open();

            // If it's success, redirect to create a Pdf
            Reports.saveStudentIdAcademicYearId(data).success(function() {
                newWindow.location = '/reports/application.pdf';
            });
        }
    }

})();
