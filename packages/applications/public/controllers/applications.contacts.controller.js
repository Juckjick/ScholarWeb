(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsContactController', ScholarshipsContact);

    ScholarshipsContact.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsContact(Global, $scope, $http, $timeout, $routeParams, Scholarships) {

        var vm = this,
            type = {
                1: 'อาจารย์',
                2: 'นิสิต'
            };

        /**
         * Variables
         */
        vm.contacts = [];

        /**
         * Functions
         */
        vm.upsertContact = upsertContact;
        vm.addContact = addContact;
        vm.deleteContact = deleteContact;

        init();

        // Initialize data
        function init() {
            vm.contacts = Scholarships.getContacts();

            // if the contact in the DB is empty,
            // default to two contacts
            if (!vm.contacts.length) {
                addContact();
                addContact();
            }
        }

        // Update or insert old scholarship 
        function upsertContact() {
            var data = {};
            vm.isSubmit = true;

            // Bind typename
            angular.forEach(vm.contacts, function (contact) {
                contact.typeName = type[contact.typeId];
            });

            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.contacts = vm.contacts;


            $http.post('/api/scholarships/upsert/contacts', data).success(function (hs) {
                vm.isSuccess = true;
                // Reinit data for the sake of getting an id from DB
                Scholarships.reInit($routeParams.StudentId, $routeParams.AcademicYearId).then(function () {
                    init();
                    $timeout(function () {
                        vm.isSaved = true;
                        vm.isSuccess = false;
                        vm.isSubmit = false;
                    }, 5000);
                });
            }).error(function (err) {
                vm.isError = true;
                $timeout(function () {
                    vm.isError = false;
                    vm.isSubmit = false;
                }, 5000);

            });
        }

        // Add a contact field
        function addContact() {
            var newContact = {};

            // Set a default contact type
            newContact.typeId = 1;
            vm.contacts.push(newContact);
        }

        // Delete a contact field
        function deleteContact(index) {
            vm.contacts.splice(index, 1);
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.seventh;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);

    }

})();
