(function () {
    angular
        .module('sms.applications')
        .controller('ScholarshipsController', Scholarships);

    Scholarships.$inject = ['$scope', 'Global', '$http', '$modal', '$timeout', '$location', '$routeParams', 'Scholarships'];

    function Scholarships($scope, Global, $http, $modal, $timeout, $location, $routeParams, Scholarship) {
        $scope.isSubmit = false;

        /**
         * Functions
         */
        $scope.sendApplication = sendApplication;
        $scope.openConfirmModal = openConfirmModal;
        $scope.cancelSendApplication = cancelSendApplication;
        $scope.openImportModal = openImportModal;
        $scope.cancelImportModal = cancelImportModal;
        $scope.isEditMode = isEditMode;
        $scope.importData = importData;

        /**
         * Send an application
         * of all tables by 1
         */
        function sendApplication() {
            $scope.isSubmit = true;
            var data = {};
            data.UserId = Global.user.id;
            $http.post('/api/scholarships/send/application', data).success(function () {
                $scope.isSuccess = true;
                $timeout(function () {
                    $scope.isSuccess = false;
                    $scope.confirmModal.close();
                    $location.path('/scholarships/apply/complete');
                }, 5000);
            }).error(function (err) {
                $scope.isError = true;
                $timeout(function () {
                    $scope.isError = false;
                    $scope.isSubmit = false;
                }, 5000);
            });
        }

        /**
         * Confirmation model
         */
        function openConfirmModal() {
            $scope.confirmModal = $modal.open({
                templateUrl: 'partials/applications/public/views/applications.confirm-modal.view',
                scope: $scope
            });
        }

        /**
         * Cancel delete modal
         */
        function cancelSendApplication() {
            $scope.confirmModal.dismiss('cancel');
        }

        /**
         * Confirmation model
         */
        function openImportModal() {
            $scope.importModal = $modal.open({
                templateUrl: 'partials/applications/public/views/applications.import-modal.view',
                scope: $scope
            });
        }

        /**
         * Cancel delete modal
         */
        function cancelImportModal() {
            $scope.importModal.dismiss('cancel');
        }

        /**
         * Import ancient data of a student application
         */
        function importData() {
            var data = {};
            data.UserId = Global.user.id;

            $scope.isSubmit = true;

            // Verify whether there is any application applied before or not
            Scholarship.loadMaxAcademicYear(data).then(function (AcademicYearId) {

                // Setup POST data
                data.AcademicYearId = AcademicYearId.data;
                if (data.AcademicYearId) {
                    // Delete all exist data of the current application
                    return Scholarship.deleteAllCurrentData(data)
                        .then(function () {
                            // Copy the data to the current year
                            return Scholarship.copyDataToCurrentYear(data);
                        })
                        .then(function () {
                            // Get new data by using the current AcademicYearId
                            return Scholarship.getPromises();
                        })
                        .then(function () {
                            $scope.isSuccess = true;
                            $timeout(function () {
                                $scope.isSuccess = false;
                                $scope.isSubmit = false;
                                $scope.importModal.close();
                            }, 5000);
                        });
                } else throw new Error('No data found on previous year');
            }).catch(function (err) {
                $scope.isError = true;
                $timeout(function () {
                    $scope.isError = false;
                    $scope.isSubmit = false;
                }, 5000);

            });
        }

        /**
         * Verify whether this editing application is
         * currently applying by Student or
         * is editing by Admin
         * @return {Boolean} is editing by Admin
         */
        function isEditMode() {
            return !!$routeParams.StudentId;
        }

    }

})();
