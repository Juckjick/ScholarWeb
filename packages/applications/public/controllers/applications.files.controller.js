(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipFileController', ScholarshipFile);

    ScholarshipFile.$inject = ['Global', '$scope', '$timeout', '$modal', '$routeParams', '$window', 'Scholarships', 'FileUploader'];

    function ScholarshipFile(Global, $scope, $timeout, $modal, $routeParams, $window, Scholarships, FileUploader) {

        var vm = this;

        /**
         * Variables
         */
        vm.uploader = new FileUploader();
        vm.files = [];
        vm.uploadedFiles = [];
        vm.errorMessage = '';

        /**
         * Functions
         */
        vm.del = del;
        vm.uploader.onBeforeUploadItem = onBeforeUploadItem;
        vm.uploader.onSuccessItem = onSuccessItem;
        vm.openDeleteModal = openDeleteModal;
        vm.cancelDeleteModal = cancelDeleteModal;
        vm.exportFile = exportFile;

        init();

        /**
         * Init defaults variables fetched from DB
         */
        function init() {
            // Set uploader properties
            vm.uploader.queueLimit = 15;
            vm.uploader.url = '/api/scholarships/upsert/file';
            vm.uploader.removeAfterUpload = true;

            // Get data from DB
            vm.files = Scholarships.getFiles();
            vm.uploadedFiles = Scholarships.getUploadedFiles();

            // Set angular-file-upload filters
            vm.uploader.filters = getFilters();

        }

        /**
         * Define all filters applied to angular-file-upload queue
         * @return {Array} filters
         */
        function getFilters() {
            var filters = [];

            // Accept only jpg/jpeg/png/pdf
            var acceptTypes = {
                name: 'acceptTypes',
                fn: function (item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    var isCorrect = '|jpg|jpeg|png|pdf|'.indexOf(type) !== -1;
                    if (!isCorrect)
                        vm.errorMessage = 'กรุณาเลือกไฟล์นามสกุล jpg, jpeg, png, หรือ pdf';
                    else
                        vm.errorMessage = '';
                    return isCorrect;
                }

            };

            // Verify from database whether the number of 
            // uploaded files exceed the set maximum or not
            var numberLimit = {
                name: 'numberLimit',
                fn: function (item) {
                    // vm.uploader.queue.length will be a length before adding the item
                    var isCorrect = vm.uploadedFiles.length + vm.uploader.queue.length < 15;
                    if (!isCorrect)
                        vm.errorMessage = 'คุณสามารถทำการอัพโหลดไฟล์ได้สูงสุดไม่เกิน 15 ไฟล์';
                    else
                        vm.errorMessage = '';
                    return isCorrect;
                }
            };

            // Accept maximum 2 MB
            var acceptSize = {
                name: 'acceptSize',
                fn: function (item) {
                    var isCorrect = item.size <= 1024 * 1024;
                    if (!isCorrect)
                        vm.errorMessage = 'กรุณาเลือกไฟลขนาดไม่เกิน 2 MB';
                    else
                        vm.errorMessage = '';
                    return isCorrect;
                }
            };

            filters.push(acceptTypes);
            filters.push(numberLimit);
            filters.push(acceptSize);

            return filters;
        }


        /**
         * Binding data of each item for POST request
         * before uploading them
         * @param  {File} item of FileUploader service
         * @see https://github.com/nervgh/angular-file-upload/wiki/Module-API
         */
        function onBeforeUploadItem(item) {
            var formData = {};

            formData.FileId = item.FileId;

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            formData.UserId = $routeParams.StudentId || Global.user.id;
            if ($routeParams.AcademicYearId)
                formData.AcademicYearId = $routeParams.AcademicYearId;

            item.formData.push(formData);
        }

        /**
         * Fetching uploadedFiles from DB, whenever,
         * a user has put a new file
         * @param  {File} item of FileUploader service
         * @see https://github.com/nervgh/angular-file-upload/wiki/Module-API
         */
        function onSuccessItem(item, response, status, headers) {
            // Fetched data from DB, including the new brand file
            Scholarships.loadUploadedFiles().success(function (uploadedFiles) {
                vm.uploadedFiles = uploadedFiles;
            }).error(function (err) {
                console.log('Cannot get uploaded files form database');
            });
        }

        /**
         * Delete a file from DB and
         * the uploadedFiles array
         * @param  {Object} from uploadedFiles
         */
        function del() {
            var data = {};

            vm.isSubmit = true;
            data.file = vm.deleteFile;

            Scholarships.deleteFile(data).success(function () {
                vm.isSuccess = true;

                // Delete form uploadedFiles array
                for (var i = 0; i < vm.uploadedFiles.length; i++) {
                    if (vm.uploadedFiles[i].id === vm.deleteFile.id) {
                        vm.uploadedFiles.splice(i, 1);
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
         * Open a delete modal of file
         */
        function openDeleteModal(file) {
            vm.deleteFile = file;
            vm.deleteModal = $modal.open({
                templateUrl: 'partials/applications/public/views/applications.file-delete-modal.view',
                scope: $scope
            });
        }

        function cancelDeleteModal() {
            vm.deleteModal.dismiss('cancel');
        }

        function exportFile(file) {
            // Set student's id and AcademicYearId in order to be used to 
            // query the student application and create a Pdf
            var data = {},
                newWindow;
            data.primaryKeyId = file.id;

            // This is important, the window.open object should be created
            // before entering the $ajax call, if not, the new window will be
            // block by a browser. Basically, it's tell the browser that
            // the request comes from a user. 
            newWindow = $window.open();

            // If it's success, redirect to create a Pdf
            Scholarships.savePrimaryKeyId(data).success(function () {
                newWindow.location = '/scholarships/export/' + file.File.name + '.' + file.mimetype.split('/')[1];
            });
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.eleventh;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
