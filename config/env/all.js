var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    packagesDir: rootPath + '/packages',

    assets: {
        lib: {
            css: [
                'assets/pace/themes/yellow/pace-theme-flash.css',
                'assets/font-awesome/css/font-awesome.min.css',
                'assets/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
                'assets/angular-ui-grid/ui-grid.min.css'
            ],
            js: [
                'assets/jquery/dist/jquery.min.js',
                'assets/lodash/lodash.min.js',
                'assets/d3/d3.min.js',
                'assets/angular/angular.min.js',
                'assets/angular-mocks/angular-mocks.js',
                'assets/angular-cookies/angular-cookies.min.js',
                'assets/angular-resource/angular-resource.min.js',
                'assets/angular-route/angular-route.min.js',
                'assets/angular-i18n/angular-locale_th-th.js',
                'assets/angular-bootstrap/ui-bootstrap.min.js',
                'assets/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'assets/angular-ui-utils/ui-utils.min.js',
                'assets/angular-ui-grid/ui-grid.min.js',
                'assets/angular-charts/dist/angular-charts.min.js',
                'assets/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
                'assets/angular-file-upload/angular-file-upload.min.js',
                'assets/angular-validation/dist/angular-validation.min.js',
                'assets/angular-smart-table/dist/smart-table.min.js',
                'assets/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                'assets/bootstrap-switch/dist/js/bootstrap-switch.min.js',
                'assets/pdfmake/build/pdfmake.min.js',
                'assets/pdfmake/build/vfs_fonts.js',
                'assets/moment/min/moment.min.js',
                'assets/pace/pace.min.js',
                'libs/angular-validation-rule.js',
                'libs/angular-ui-datepicker-be.min.js'
            ],
            sourceMap: [
                'assets/jquery/dist/jquery.min.map',
                'assets/pdfmake/build/pdfmake.min.map'
            ],
            font: [
                'assets/font-awesome/fonts/*'
            ],
            uiGrid: [
                'assets/angular-ui-grid/ui-grid.eot',
                'assets/angular-ui-grid/ui-grid.svg',
                'assets/angular-ui-grid/ui-grid.ttf',
                'assets/angular-ui-grid/ui-grid.woff'
            ]
        },
        sms: {
            css: [
                'public/css/sms.css'
            ],
            sass: [
                'sass/style.scss'
            ],
            js: [
                'cores/public/cores.init.js',
                'cores/public/cores.module.js',
                'cores/public/routes/cores.route.js',
                'cores/public/controllers/cores.index.controller.js',
                'cores/public/controllers/cores.header.controller.js',
                'cores/public/controllers/cores.sidebar.controller.js',
                'cores/public/services/cores.global.factory.js',
                'cores/public/services/cores.menus.factory.js',
                'cores/public/services/cores.authorization.factory.js',
                'cores/public/services/cores.exception.factory.js',
                'cores/public/services/cores.date.filter.js',
                'users/public/users.module.js',
                'users/public/routes/users.route.js',
                'users/public/controllers/users.controller.js',
                'users/public/controllers/users.profile.controller.js',
                'users/public/services/users.factory.js',
                'roles/public/roles.module.js',
                'roles/public/routes/roles.route.js',
                'roles/public/controllers/roles.controller.js',
                'applications/public/applications.module.js',
                'applications/public/routes/applications.route.js',
                'applications/public/controllers/applications.index.controller.js',
                'applications/public/controllers/applications.profile.controller.js',
                'applications/public/controllers/applications.scholarships.controller.js',
                'applications/public/controllers/applications.scholarships.controller.js',
                'applications/public/controllers/applications.families.controller.js',
                'applications/public/controllers/applications.cashes.controller.js',
                'applications/public/controllers/applications.health.controller.js',
                'applications/public/controllers/applications.activity.controller.js',
                'applications/public/controllers/applications.contacts.controller.js',
                'applications/public/controllers/applications.reason.controller.js',
                'applications/public/controllers/applications.job.controller.js',
                'applications/public/controllers/applications.loan.controller.js',
                'applications/public/controllers/applications.files.controller.js',
                'applications/public/controllers/applications.complete.controller.js',
                'applications/public/controllers/applications.edit-list.controller.js',
                'applications/public/controllers/applications.settings.controller.js',
                'applications/public/services/applications.factory.js',
                'interviews/public/interviews.module.js',
                'interviews/public/routes/interviews.route.js',
                'interviews/public/controllers/interviews.evaluation-list.controller.js',
                'interviews/public/controllers/interviews.summary-list.controller.js',
                'interviews/public/controllers/interviews.evaluation.controller.js',
                'interviews/public/controllers/interviews.summary.controller.js',
                'interviews/public/services/interviews.factory.js',
                'budgets/public/budgets.module.js',
                'budgets/public/routes/budgets.route.js',
                'budgets/public/controllers/budgets.mainbudgets.controller.js',
                'budgets/public/controllers/budgets.subbudgets.controller.js',
                'budgets/public/controllers/budgets.transactions.controller.js',
                'budgets/public/controllers/budgets.graphs.controller.js',
                'budgets/public/controllers/budgets.tables.controller.js',
                'budgets/public/services/budgets.factory.js',
                'budgets/public/services/budgets.transactions.factory.js',
                'reports/public/reports.module.js',
                'reports/public/routes/reports.route.js',
                'reports/public/controllers/reports.students.controller.js',
                'reports/public/controllers/reports.results.controller.js',
                'reports/public/controllers/reports.loans.controller.js',
                'reports/public/controllers/reports.scholarships.controller.js',
                'reports/public/services/reports.factory.js',
                'settings/public/settings.module.js',
                'settings/public/routes/settings.route.js',
                'settings/public/controllers/settings.academicyear.controller.js',
                'settings/public/services/settings.factory.js'
            ]
        }
    }
};
