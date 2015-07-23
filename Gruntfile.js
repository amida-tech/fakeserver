module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express-server');

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
        }
    });

    grunt.registerTask('default', ['express', 'mochaTest']);
};