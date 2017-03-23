(function () {
    'use strict';
    //Menus service used for facilitating menus and submenus
    angular
        .module('sms.applications')
        .factory("Scholarships", Scholarships);

    Scholarships.$inject = ['Global', '$http', '$q'];

    function Scholarships(Global, $http, $q) {
        var scholarshipFactory = {},
            profile = {},
            adoption = {},
            health = {},
            activity = {},
            reason = {},
            titles = [],
            addresses = [],
            provinces = [],
            facultiesDepartments = [],
            majors = [],
            scholarships = [],
            families = [],
            cashes = [],
            contacts = [],
            jobs = [],
            loans = [],
            files = [],
            uploadedFiles = [],
            data = {};

        /**
         * Functions
         */
        scholarshipFactory.getPromises = getPromises;
        scholarshipFactory.getTitles = getTitles;
        scholarshipFactory.getProvinces = getProvinces;
        scholarshipFactory.getProfile = getProfile;
        scholarshipFactory.getAddressByMomentId = getAddressByMomentId;
        scholarshipFactory.getFacultiesDepartments = getFacultiesDepartments;
        scholarshipFactory.getMajors = getMajors;
        scholarshipFactory.getScholarshipsByMomentId = getScholarshipsByMomentId;
        scholarshipFactory.getFamilyMember = getFamilyMember;
        scholarshipFactory.getFamilySiblings = getFamilySiblings;
        scholarshipFactory.getAdoption = getAdoption;
        scholarshipFactory.getHealth = getHealth;
        scholarshipFactory.getCash = getCash;
        scholarshipFactory.getActivity = getActivity;
        scholarshipFactory.getContacts = getContacts;
        scholarshipFactory.getReason = getReason;
        scholarshipFactory.getJobs = getJobs;
        scholarshipFactory.getLoan = getLoan;
        scholarshipFactory.getFiles = getFiles;
        scholarshipFactory.getUploadedFiles = getUploadedFiles;
        scholarshipFactory.loadUploadedFiles = loadUploadedFiles;
        scholarshipFactory.deleteFile = deleteFile;
        scholarshipFactory.reInit = reInit;
        scholarshipFactory.loadMaxAcademicYear = loadMaxAcademicYear;
        scholarshipFactory.deleteAllCurrentData = deleteAllCurrentData;
        scholarshipFactory.copyDataToCurrentYear = copyDataToCurrentYear;
        scholarshipFactory.savePrimaryKeyId = savePrimaryKeyId;

        return scholarshipFactory;


        function generatePromises() {
            var promises = {};

            // Get UserAddress data
            promises.titles = $http.post('/api/scholarships/load/titles', data);

            // Get UserAddress data
            promises.provinces = $http.post('/api/scholarships/load/provinces', data);

            // Get UserProfile data
            promises.profile = $http.post('/api/scholarships/load/profile', data);

            // Get UserAddress data
            promises.addresses = $http.post('/api/scholarships/load/addresses', data);

            // Get Faculty joined with Department data
            promises.facultiesDepartments = $http.post('/api/scholarships/load/faculties-departments', data);

            // Get Majors
            promises.majors = $http.post('/api/scholarships/load/majors', data);

            // Get UserScholarship data
            promises.scholarships = $http.post('/api/scholarships/load/scholarships', data);

            // Get UserFamily data
            promises.families = $http.post('/api/scholarships/load/families', data);

            // Get Adoption data
            promises.adoption = $http.post('/api/scholarships/load/adoption', data);

            // Get UserCash data
            promises.cashes = $http.post('/api/scholarships/load/cashes', data);

            // Get UserHealth data
            promises.health = $http.post('/api/scholarships/load/health', data);

            // Get UserActivity data
            promises.activity = $http.post('/api/scholarships/load/activity', data);

            // Get UserContact data
            promises.contacts = $http.post('/api/scholarships/load/contacts', data);

            // Get UserReason data
            promises.reason = $http.post('/api/scholarships/load/reason', data);

            // Get Job data
            promises.jobs = $http.post('/api/scholarships/load/jobs', data);

            // Get Loan data
            promises.loans = $http.post('/api/scholarships/load/loans', data);

            // Get Files data
            promises.files = $http.post('/api/scholarships/load/files', data);

            // Get Uploaded files data
            promises.uploadedFiles = $http.post('/api/scholarships/load/uploaded-files', data);

            return promises;
        }

        function getPromises(StudentId, AcademicYearId) {
            var promises;

            // If the StudentId is given, this means that
            // the application will be modified by another person (Administrator).
            // Otherwise, the application will be modified by a student
            if (StudentId) {
                data.id = StudentId;
            } else {
                data.id = Global.user.id;
            }
            data.AcademicYearId = AcademicYearId;


            promises = generatePromises();

            return $q.all(promises).then(function (results) {
                titles = results.titles.data || [];
                provinces = results.provinces.data || [];
                profile = results.profile.data || {};
                addresses = results.addresses.data || [];
                facultiesDepartments = results.facultiesDepartments.data || [];
                majors = results.majors.data || [];
                scholarships = results.scholarships.data || [];
                families = results.families.data || [];
                adoption = results.adoption.data || {};
                cashes = results.cashes.data || [];
                activity = results.activity.data || {};
                health = results.health.data || {};
                contacts = results.contacts.data || [];
                reason = results.reason.data || {};
                jobs = results.jobs.data || [];
                loans = results.loans.data || [];
                files = results.files.data || [];
                uploadedFiles = results.uploadedFiles.data || [];
            });
        }

        function getTitles() {
            return titles;
        }

        function getProvinces() {
            return provinces;
        }

        function getProfile() {
            return profile;
        }

        function getAddressByMomentId(momentId) {
            for (var i = 0; i < addresses.length; i++) {
                if (addresses[i].momentId === momentId)
                    return addresses[i];
            }
            return {};
        }

        function getFacultiesDepartments() {
            return facultiesDepartments;
        }

        function getMajors() {
            return majors;
        }

        function getScholarshipsByMomentId(momentId) {
            var response = [];
            for (var i = 0; i < scholarships.length; i++) {
                if (scholarships[i].momentId === momentId)
                    response.push(scholarships[i]);
            }
            return response;
        }

        function getFamilyMember(FamilyRelationId) {
            for (var i = 0; i < families.length; i++) {
                if (families[i].FamilyRelationId === FamilyRelationId)
                    return families[i];
            }
            return {};
        }

        function getFamilySiblings() {
            var siblings = [];
            for (var i = 0; i < families.length; i++) {
                if (families[i].FamilyRelationId === 5)
                    siblings.push(families[i]);
            }
            return siblings;
        }

        function getAdoption() {
            return adoption;
        }

        function getHealth() {
            return health;
        }

        function getCash(typeId) {
            for (var i = 0; i < cashes.length; i++) {
                if (cashes[i].typeId === typeId)
                    return cashes[i];
            }
        }

        function getActivity() {
            return activity;
        }

        function getContacts() {
            return contacts;
        }

        function getReason() {
            return reason;
        }

        function getJobs() {
            return jobs;
        }

        function getLoan(typeId, goalId) {
            for (var i = 0; i < loans.length; i++) {
                if (loans[i].typeId === typeId && loans[i].goalId === goalId)
                    return loans[i];
            }
            return {};
        }

        function getFiles() {
            return files;
        }

        function getUploadedFiles() {
            return uploadedFiles;
        }

        /**
         * Load UserFile from DB
         * @return {Promise} of uploaded files
         */
        function loadUploadedFiles() {
            return $http.post('/api/scholarships/load/uploaded-files', data);
        }

        function deleteFile(data) {
            return $http.post('/api/scholarships/delete/file', data);
        }

        function reInit(StudentId, AcademicYearId) {
            return scholarshipFactory.getPromises(StudentId, AcademicYearId);
        }

        function loadMaxAcademicYear(data) {
            return $http.post('/api/scholarships/load/max-academicyearid', data);
        }

        function deleteAllCurrentData(data) {
            return $http.post('/api/scholarship/delete/all-data', data);
        }

        function copyDataToCurrentYear(data) {
            return $http.post('/api/scholarships/copy/ancient-to-current', data);
        }

        /**
         * Save a StudentId and Version data before
         * requesting the "get" data for exporting a file
         * @param  {Object} data
         * @return {Promise} of the request
         */
        function savePrimaryKeyId(data) {
            return $http.post('/api/scholarships/save/primarykeyid', data);
        }

    }

})();
