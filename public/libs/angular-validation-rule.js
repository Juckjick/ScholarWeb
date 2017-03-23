(function() {
    angular.module('validation.rule', ['validation'])
        .config(['$validationProvider',
            function($validationProvider) {

                var expression = {
                    required: function(value) {
                        return !!value;
                    },
                    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                    email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,5}|[0-9]{1,3})(\]?)$/,
                    number: /^\d+$/,
                    decimal: /[0-9]+(\.[0-9][0-9])?/,
                    boolean: function(value) {
                        if (typeof value === 'boolean')
                            return true;
                        return false;
                    },
                    identical: function(value, scope, element, attrs) {
                        if (value)
                            return value === attrs.identicalWith;
                        return false;
                    },
                    username: /^[0-9]{13}$/,
                    password: /^.{8,}$/
                };

                var defaultMsg = {
                    required: {
                        error: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                        success: ''
                    },
                    url: {
                        error: 'กรุณากรอก URL ให้ถูกต้อง',
                        success: ''
                    },
                    email: {
                        error: 'กรุณากรอกอีเมลล์ให้ถูกต้อง',
                        success: ''
                    },
                    number: {
                        error: 'กรุณากรอกข้อมูลเป็นตัวเลข (0-9)',
                        success: ''
                    },
                    decimal: {
                        error: 'กรุณากรอกเลขทศนิยม 2 ตำแหน่ง',
                        success: ''
                    },
                    boolean: {
                        error: 'กรุณาเลือกตัวเลือกให้ถูกต้อง',
                        success: ''
                    },
                    identical: {
                        error: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                        success: ''
                    },
                    username: {
                        error: 'กรุณากรอกรเลขบัตรประชาชนผู้ใช้งาน เป็นตัวเลข 13 หลัก',
                        success: ''
                    },
                    password: {
                        error: 'กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร',
                        success: ''
                    }
                };

                $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

            }
        ]);

}).call(this);
