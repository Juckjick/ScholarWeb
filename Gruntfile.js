var _ = require('underscore');
var config = require('./config/env/all');

// Modify urls to be absolute path
function modifyUrls(urls) {
    var firstChunk;
    _.each(urls, function (url, index) {
        firstChunk = url.split('/')[0];

        // Libraries from bower
        if (firstChunk === 'assets')
            urls[index] = url.replace('assets', 'bower_components');

        // Custom libraries
        else if (firstChunk === 'libs')
            urls[index] = 'public/' + url;

        // All packages
        else
            urls[index] = 'packages/' + url;
    });
    return urls;
}

module.exports = function (grunt) {

    require('time-grunt')(grunt);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * Scholarship Management System (SMS) v<%= pkg.version %>\n' +
        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Contact <%= pkg.contact %>\n' +
        ' */\n',
        watch: {
            jade: {
                files: ['public/**/*.jade', 'packages/**/*.jade'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/**/*.js', 'packages/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/**', 'packages/**/*.css'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['sass/**'],
                options: {
                    livereload: true
                },
                tasks: ['sass']
            }

        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    ignore: ['README.md', 'node_modules/**', 'bower_components/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['packages', 'config'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'app/**/*.js', 'public/js/**/*.js', 'packages/**/*.js', 'test/mocha/**/*.js', 'test/karma/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        clean: {
            dist: ['public/dist/**'],
            annotate: 'public/dist/js/sms.annotate.js'
        },
        copy: {
            font: {
                expand: true,
                flatten: true,
                src: modifyUrls(config.assets.lib.font),
                dest: 'public/dist/fonts/'
            },
            sourceMap: {
                expand: true,
                flatten: true,
                src: modifyUrls(config.assets.lib.sourceMap),
                dest: 'public/dist/js'
            },
            uiGrid: {
                expand: true,
                flatten: true,
                src: modifyUrls(config.assets.lib.uiGrid),
                dest: 'public/dist/css'
            }
        },
        sass: {
            task: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/css/sms.css': config.assets.sms.sass
                }
            }
        },
        concat: {
            cssLib: {
                src: modifyUrls(config.assets.lib.css),
                dest: 'public/dist/css/lib.min.css'
            },
            jsLib: {
                src: modifyUrls(config.assets.lib.js),
                dest: 'public/dist/js/lib.min.js'
            }
        },
        cssmin: {
            options: {
                relativeTo: 'can be what ever dont know why'
            },
            cssSms: {
                files: {
                    'public/dist/css/sms.min.css': config.assets.sms.css
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            task: {
                files: {
                    'public/dist/js/sms.annotate.js': modifyUrls(config.assets.sms.js)
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            jsSms: {
                files: {
                    'public/dist/js/sms.min.js': 'public/dist/js/sms.annotate.js'
                }
            }
        },
        usebanner: {
            task: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['public/dist/css/sms.min.css', 'public/dist/js/sms.min.js']
                }
            }
        },
        fixtures: {
            data: {
                src: [
                    'packages/applications/server/fixtures/childcare.json',
                    'packages/applications/server/fixtures/title.json',
                    'packages/applications/server/fixtures/file.json',
                    'packages/applications/server/fixtures/faculty.json',
                    'packages/applications/server/fixtures/department.json',
                    'packages/applications/server/fixtures/major.json',
                    'packages/applications/server/fixtures/familyrelation.json',
                    'packages/applications/server/fixtures/familystatus.json',
                    'packages/applications/server/fixtures/province.json',
                    'packages/applications/server/fixtures/job.json',
                    'packages/interviews/server/fixtures/interviewcriteria.json',
                    'packages/cores/server/fixtures/system.json',
                    'packages/cores/server/fixtures/subsystem.json',
                    'packages/roles/server/fixtures/role.json',
                    'packages/users/server/fixtures/user.json',
                    'packages/**/fixtures/api.json'
                ],
                models: function () {
                    return require('./packages/cores/server/fixtures/index');
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: './karma.conf.js'
            }
        }

    });

    //Load NPM tasks 
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('sequelize-fixtures');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Development environment task(s).
    grunt.registerTask('default', ['jshint', 'sass', 'concurrent']);

    // Production environment task(s).
    grunt.registerTask('build', ['clean:dist', 'copy', 'concat', 'sass', 'cssmin', 'ngAnnotate', 'uglify', 'usebanner', 'clean:annotate']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'jshint', 'karma:unit']);

    //Data fixtures task(s).
    grunt.registerTask('data', ['fixtures:data']);
};
