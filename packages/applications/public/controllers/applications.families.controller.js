(function () {
    'use strict';

    angular
        .module('sms.applications')
        .controller('ScholarshipsFamilyController', ScholarshipsFamily);

    ScholarshipsFamily.$inject = ['Global', '$scope', '$http', '$timeout', '$routeParams', 'Scholarships'];

    function ScholarshipsFamily(Global, $scope, $http, $timeout, $routeParams, Scholarships) {
        var vm = this;

        /**
         * Variables
         */
        vm.father = {};
        vm.mother = {};
        vm.adopter = {};
        vm.adoption = {};
        vm.stepFamily = {};
        vm.profile = {};
        vm.hasMember = {};
        vm.siblings = [];

        /**
         * Functions
         */
        vm.sanitizeMember = sanitizeMember;
        vm.upsertFamily = upsertFamily;
        vm.addSibling = addSibling;
        vm.deleteSibling = deleteSibling;

        init();

        // Initialize data
        function init() {
            vm.profile = Scholarships.getProfile();

            vm.father = Scholarships.getFamilyMember(1);
            vm.mother = Scholarships.getFamilyMember(2);
            vm.adopter = Scholarships.getFamilyMember(3);
            vm.stepFamily = Scholarships.getFamilyMember(4);
            vm.adoption = Scholarships.getAdoption();

            // Set default FamilyStatusId to บิดา/มารดา อยู่ร่วมกัน 
            // if the profile.FamilyStatusId has never been created
            if (!vm.profile.hasOwnProperty('FamilyStatusId'))
                vm.profile.FamilyStatusId = 1;

            // Check the hasMember checkbox if each member does exist in DB
            vm.hasMember.father = !!Object.getOwnPropertyNames(vm.father).length;
            vm.hasMember.mother = !!Object.getOwnPropertyNames(vm.mother).length;
            vm.hasMember.adopter = !!Object.getOwnPropertyNames(vm.adopter).length;
            vm.hasMember.stepFamily = !!Object.getOwnPropertyNames(vm.stepFamily).length;
            vm.hasMember.adoption = !!Object.getOwnPropertyNames(vm.adoption).length;

            vm.siblings = Scholarships.getFamilySiblings();
        }

        // Set member object
        function sanitizeMember(member) {
            // If the member checkbox was checked and the vm[member] object is empty
            // Set default isAlive for father or mother
            if (vm.hasMember[member] && !Object.getOwnPropertyNames(vm[member]).length &&
                (member === 'father' || member === 'mother' || member === 'adopter')
            )
                vm[member].isAlive = true;

            // If the member checkbox was unchecked and the vm[member] object isn't empty,
            // the member object should be empty
            if (!vm.hasMember[member] && Object.getOwnPropertyNames(vm[member]).length)
                vm[member] = {};
        }

        // Update or insert families 
        function upsertFamily() {
            var data = {};
            // If the StudentId and AcademicYearId are given in the route, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            data.UserId = $routeParams.StudentId || Global.user.id;
            data.AcademicYearId = $routeParams.AcademicYearId || null;

            data.families = [];
            data.profile = vm.profile;

            vm.isSubmit = true;
            /* 
             * Add a member only if it isn't empty
             */

            if (Object.getOwnPropertyNames(vm.adoption).length)
                data.adoption = vm.adoption;

            // Specify relations and put into families array
            if (Object.getOwnPropertyNames(vm.father).length) {
                vm.father.FamilyRelationId = 1;
                data.families.push(vm.father);
            }
            if (Object.getOwnPropertyNames(vm.mother).length) {
                vm.mother.FamilyRelationId = 2;
                data.families.push(vm.mother);
            }

            if (Object.getOwnPropertyNames(vm.adopter).length) {
                vm.adopter.FamilyRelationId = 3;
                data.families.push(vm.adopter);
            }
            if (Object.getOwnPropertyNames(vm.stepFamily).length) {
                vm.stepFamily.FamilyRelationId = 4;
                data.families.push(vm.stepFamily);
            }

            angular.forEach(vm.siblings, function (sibling) {
                sibling.FamilyRelationId = 5;
            });

            data.families = data.families.concat(vm.siblings);

            $http.post('/api/scholarships/upsert/families', data).success(function (family) {
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

        // Add a scholarship field
        function addSibling() {
            vm.siblings.push({});
        }

        // Delete a scholarship field
        function deleteSibling(index) {
            vm.siblings.splice(index, 1);
        }

        /**
         * When the accordion was clicked,
         * we'll get a data from the Scholarships service
         * by using init() function
         */
        $scope.$watch(function () {
            return $scope.third;
        }, function (newValue) {
            if (newValue && newValue.open)
                init();
        }, true);
    }

})();
