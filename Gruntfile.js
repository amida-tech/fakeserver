module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-env');

    grunt.initConfig({
        express: {
            test: {
                options: {
                    script: './index.js'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    queit: false,
                    clearRequireCache: true
                },
                src: ['test/*.js']
            }
        },
        env: {
            test: {
                NODE_ENV: 'production',
                FAKE_DELAY: 10
            }
        }
    });
    grunt.registerTask('default', ['env:test', 'express', 'mochaTest']);
};