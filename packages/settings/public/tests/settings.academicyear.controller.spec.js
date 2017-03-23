(function () {
    "use strict";

    describe('SettingAcademicYearController', function () {
        var $controller, $scope, vm, $httpBackend, $timeout;

        beforeEach(module('sms'));

        beforeEach(inject(function (_$controller_, _$httpBackend_, _$timeout_) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            $scope = {};
            vm = $controller('SettingAcademicYearController', {$scope: $scope});
        }));

        describe('calculateStartEndPage function', function () {
            it('should set the startPage and endPage to 11 and 20 respectively, when parameter = 2, itemByPage = 10, and ayList = 20', function () {
                vm.ayList = new Array(20);
                vm.itemByPage = 10;
                vm.calculateStartEndPage(2);

                expect(vm.startPage).toBe(11);
                expect(vm.endPage).toBe(20);
            });
            it('should set the endPage to 5 , when parameter = 1, itemByPage = 10, and ayList = 5', function () {
                vm.ayList = new Array(5);
                vm.itemByPage = 10;
                vm.calculateStartEndPage(1);

                expect(vm.endPage).toBe(5);
            });
        });

        describe('upsertAy function', function () {
            it('should send a POST request and isSuccess should be true (valid data)', function () {
                vm.newAy = {
                    name: '2557',
                    startDate: new Date(),
                    endDate: new Date()
                };
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([]);
                $httpBackend.expectPOST('/api/settings/academicyear/upsert').respond(200);

                vm.upsertAy();
                $httpBackend.flush();
                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isSuccess).toBeTruthy();

                // Return to false after timeout
                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isSuccess).toBeFalsy();
            });

            it('should send a POST request and isError should be true (valid data) with an error from server', function () {
                vm.newAy = {
                    name: '2557',
                    startDate: new Date(),
                    endDate: new Date()
                };
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([]);
                $httpBackend.expectPOST('/api/settings/academicyear/upsert').respond(500);

                vm.upsertAy();
                $httpBackend.flush();
                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isError).toBeTruthy();

                // Return to false after timeout
                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isError).toBeFalsy();
            });

            it('should send a POST request and isError should be true (invalid data)', function () {
                vm.newAy = {
                    name: '2557'
                };

                vm.upsertAy();
                expect(vm.isSubmit).toBeTruthy();

            });
        });

        describe('edit function', function () {
            beforeEach(function () {
                vm.editModal = {
                    close: function () {
                    }
                };
            });
            it('should call POST request and isSuccess should be true (valid data)', function () {
                vm.editAy = {
                    name: '2557',
                    startDate: new Date(),
                    endDate: new Date()
                };
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([]);
                $httpBackend.expectPOST('/api/settings/academicyear/upsert').respond(200);

                vm.edit();
                $httpBackend.flush();
                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isSuccess).toBeTruthy();

                // Return to false after timeout
                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isSuccess).toBeFalsy();

            });

            it('should call POST request and isSuccess should be true (valid data) with an error from the server', function () {
                vm.editAy = {
                    name: '2557',
                    startDate: new Date(),
                    endDate: new Date()
                };
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([]);
                $httpBackend.expectPOST('/api/settings/academicyear/upsert').respond(500);

                vm.edit();
                $httpBackend.flush();
                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isError).toBeTruthy();

                // Return to false after timeout
                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isError).toBeFalsy();

            });

            it('should send a POST request and isError should be true (invalid data)', function () {
                vm.editAy = {
                    name: '2557'
                };

                vm.edit();
                expect(vm.isSubmit).toBeTruthy();

            });
        });

        describe('del function', function () {
            beforeEach(function () {
                vm.deleteModal = {
                    close: function () {
                    }
                };
                vm.deleteAy = {
                    id: 20,
                    name: '2557',
                    startDate: new Date(),
                    endDate: new Date()
                };
            });

            it('should call POST request, isSuccess should be true, and ayList should be empty (valid data)', function () {
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([vm.deleteAy]);
                $httpBackend.expectPOST('/api/settings/academicyear/delete').respond(200);

                vm.del();
                $httpBackend.flush();

                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isSuccess).toBeTruthy();
                expect(vm.ayList.length).toEqual(0);

                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isSuccess).toBeFalsy();

            });

            it('should call POST request, isSuccess should be true, and ayList should be empty (valid data) with an error from a server', function () {
                $httpBackend.expectPOST('/api/settings/academicyear/load').respond([vm.deleteAy]);
                $httpBackend.expectPOST('/api/settings/academicyear/delete').respond(500);

                vm.del();
                $httpBackend.flush();

                expect(vm.isSubmit).toBeTruthy();
                expect(vm.isError).toBeTruthy();
                expect(vm.ayList.length).toEqual(1);

                $timeout.flush();
                expect(vm.isSubmit).toBeFalsy();
                expect(vm.isError).toBeFalsy();

            });

        });
    });
})();
