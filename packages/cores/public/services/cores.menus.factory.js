(function() {
    'use strict';

    /* jshint loopfunc: true */

    //Menus service used for facilitating menus and submenus
    angular
        .module('sms')
        .factory("Menus", Menus);

    Menus.$inject = ['Global', '$http'];

    function Menus(Global, $http) {
        var menuFactory = {},
            currentMenuId,
            menus,
            subMenus;

        /**
         * Functions
         */
        menuFactory.getMenuId = getMenuId;
        menuFactory.setMenuId = setMenuId;
        menuFactory.getMenus = getMenus;
        menuFactory.getSubMenus = getSubMenus;
        menuFactory.getCurrentMainMenu = getCurrentMainMenu;

        return menuFactory;

        function initMenus(callback) {
            generateMenus();
            generateSubMenus();
            filterSubMenusAndMenus(callback);
        }

        function generateMenus() {

            // Menus and Submenus
            menus = [{
                "id": 1,
                "title": "ผู้ใช้งาน",
                "link": "systems",
                "icon": 'fa fa-users'
            }, {
                "id": 2,
                "title": "ทุนการศึกษา",
                "link": "scholarships",
                "icon": 'fa fa-graduation-cap'
            }, {
                "id": 3,
                "title": "เงินทุน",
                "link": "budgets",
                "icon": 'fa fa-bank'
            }, {
                "id": 4,
                "title": "รายงาน",
                "link": "reports",
                "icon": 'fa fa-file-o'
            }, {
                "id": 5,
                "title": "ตั้งค่า",
                "link": "settings",
                "icon": 'fa fa-gear'
            }];
        }

        function generateSubMenus() {

            var userSubMenus = [{
                "parentId": 1,
                "groupName": "ผู้ใช้งาน",
                "groupIcon": "fa fa-users",
                "menus": [{
                    "id": 1,
                    "title": "เพิ่มผู้ใช้งาน",
                    "link": "systems/users/create",
                    "icon": "fa fa-plus-square-o"
                }, {
                    "id": 2,
                    "title": "แก้ไขผู้ใช้งาน",
                    "link": "systems/users/list",
                    "icon": "fa fa-pencil-square-o"
                }]
            }, {
                "parentId": 1,
                "groupName": "สิทธิผู้ใช้งาน",
                "groupIcon": "fa fa-eye",
                "menus": [{
                    "id": 3,
                    "title": "เพิ่มสิทธิ",
                    "link": "systems/roles/create",
                    "icon": "fa fa-plus-square-o"
                }, {
                    "id": 4,
                    "title": "แก้ไขสิทธิ",
                    "link": "systems/roles/list",
                    "icon": "fa fa-pencil-square-o"
                }]
            }];

            var scholarshipSubMenus = [{
                "parentId": 2,
                "groupName": "ระบบทุนการศึกษา",
                "groupIcon": "fa fa-graduation-cap",
                "menus": [{
                    "id": 5,
                    "title": "สมัครทุนการศึกษา",
                    "link": "scholarships/apply",
                    "icon": "fa fa-pencil"
                }, {
                    "id": 6,
                    "title": "แก้ไขใบสมัคร",
                    "link": "scholarships/edit/list",
                    "icon": "fa fa-edit"
                // }, {
                //     "id": 7,
                //     "title": "สัมภาษณ์ทุนการศึกษา",
                //     "link": "scholarships/interview/evaluation/list",
                //     "icon": "fa fa-file-o"
                // }, {
                //     "id": 8,
                //     "title": "สรุปผลทุนการศึกษา",
                //     "link": "scholarships/interview/summary/list",
                //     "icon": "fa fa-file-text-o"
                }, {
                    "id": 9,
                    "title": "ปรับเวลารับสมัครทุนการศึกษา",
                    "link": "scholarships/setting",
                    "icon": "fa fa-gear"
                }]
            }];

            var budgetSubMenus = [{
                "parentId": 3,
                "groupName": "เงินทุนหลัก",
                "groupIcon": "fa fa-bank",
                "menus": [{
                    "id": 10,
                    "title": "เพิ่มประเภทเงินทุนหลัก",
                    "link": "budgets/main/create",
                    "icon": "fa fa-plus-square-o"
                }, {
                    "id": 11,
                    "title": "แก้ไขประเภทเงินทุนหลัก",
                    "link": "budgets/main/list",
                    "icon": "fa fa-pencil-square-o"
                }]
            }, {
                "parentId": 3,
                "groupName": "เงินทุนย่อย",
                "groupIcon": "fa fa-bitcoin",
                "menus": [{
                    "id": 12,
                    "title": "เพิ่มประเภทเงินทุนย่อย",
                    "link": "budgets/sub/create",
                    "icon": "fa fa-plus-square-o"
                }, {
                    "id": 13,
                    "title": "แก้ไขประเภทเงินทุนย่อย",
                    "link": "budgets/sub/list",
                    "icon": "fa fa-pencil-square-o"
                }]
            }, {
                "parentId": 3,
                "groupName": "งบประมาณเงินทุน",
                "groupIcon": "fa fa-money",
                "menus": [{
                    "id": 14,
                    "title": "เพิ่ม / ลด งบประมาณ",
                    "link": "budgets/transactions/edit",
                    "icon": "fa fa-edit"
                }]
            }, {
                "parentId": 3,
                "groupName": "ข้อมูลเงินทุน",
                "groupIcon": "fa fa-line-chart",
                "menus": [{
                    "id": 15,
                    "title": "แผนภาพเงินทุน",
                    "link": "budgets/graphs/chart",
                    "icon": "fa fa-pie-chart"
                }, {
                    "id": 16,
                    "title": "ตารางเงินทุน",
                    "link": "budgets/graphs/table",
                    "icon": "fa fa-table"
                }]
            }];


            var reportSubMenus = [{
                "parentId": 4,
                "groupName": "รายงาน",
                "groupIcon": "fa fa-file-o",
                "menus": [{
                    "id": 17,
                    "title": "รายงานข้อมูลนิสิต",
                    "link": "reports/student",
                    "icon": "fa fa-child"
                }, {
                    "id": 18,
                    "title": "รายงานเงินกู้ยืมรัฐบาล",
                    "link": "reports/loan",
                    "icon": "fa fa-money"
                }, {
                    "id": 19,
                    "title": "รายงานทุนอุดหนุน",
                    "link": "reports/scholarship",
                    "icon": "fa fa-money"
                }, {
                    "id": 20,
                    "title": "รายงานสรุปรวมทุน",
                    "link": "reports/result",
                    "icon": "fa fa-file-text"
                }]
            }];

            var academicYearSubMenus = [{
                "parentId": 5,
                "groupName": "ปีการศึกษา",
                "groupIcon": "fa fa-calendar",
                "menus": [{
                    "id": 21,
                    "title": "เพิ่มปีการศึกษา",
                    "link": "settings/academicyear/create",
                    "icon": "fa fa-plus-square-o"
                }, {
                    "id": 22,
                    "title": "แก้ไขปีการศึกษา",
                    "link": "settings/academicyear/list",
                    "icon": "fa fa-pencil-square-o"
                }]
            }];

            // Combine sub menus arrays together
            subMenus = userSubMenus
                .concat(scholarshipSubMenus)
                // .concat(budgetSubMenus)
                .concat(reportSubMenus)
                .concat(academicYearSubMenus);
        }


        // Filter subMenus, only returns subMenus that user is allowed to see.
        function filterSubMenusAndMenus(callback) {
            var data = {};
            data.UserId = Global.user.id;
            $http.post('/api/authorization/load/authorized-subsystemid', data).success(function(results) {
                // Put all the SubSystemId results objects into an array
                var SubSystemIds = [];

                angular.forEach(results, function(result) {
                    SubSystemIds.push(result.SubSystemId);
                });

                // Remove a subMenu that the current user can't access
                for (var i = 0; i < subMenus.length; i++) {
                    for (var j = subMenus[i].menus.length - 1; j >= 0; j--) { // Loop backward because we remove an element from the array
                        if (SubSystemIds.indexOf(subMenus[i].menus[j].id) === -1) {
                            subMenus[i].menus.splice(j, 1);
                        }
                    }
                }

                // Remove a subMenu that doesn't have a menu
                for (var k = subMenus.length - 1; k >= 0; k--) {
                    if (!subMenus[k].menus.length) {
                        subMenus.splice(k, 1);
                    }
                }


                // When the subMenus have done
                filterMenus();
                callback();
            });
        }

        // Filter menus, only returns menus that have at least a subMenu
        function filterMenus() {
            var hasSubMenu;
            // Remove menus that don't have a subMenu
            for (var i = menus.length - 1; i >= 0; i--) {
                hasSubMenu = false;
                angular.forEach(subMenus, function(subMenu) {
                    if (menus[i].id === subMenu.parentId) {
                        hasSubMenu = true;
                    }
                });
                if (!hasSubMenu)
                    menus.splice(i, 1);
            }
        }


        function getMenuId() {
            return currentMenuId;
        }

        function setMenuId(menuId) {
            currentMenuId = menuId;
        }

        function getMenus(callback) {
            // Return whenever all the processes 
            // of generating menus have done
            initMenus(function() {
                callback(null, menus);
            });
        }

        function getSubMenus() {
            var subTemp = [];
            if (currentMenuId) {
                for (var i = 0; i < subMenus.length; i++) {
                    if (subMenus[i].parentId === currentMenuId) {
                        subTemp.push(subMenus[i]);
                    }
                }
                return subTemp;
            }
            return null;
        }

        function getCurrentMainMenu() {
            var result;
            angular.forEach(menus, function(menu) {
                if (menu.id === currentMenuId) {
                    result = menu;
                }
            });
            return result;
        }
    }
})();
