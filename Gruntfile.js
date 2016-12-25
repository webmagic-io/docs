var path = require("path");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        'gh-pages': {
            options: {
                base: '_book'
            },
            src: ['**']
        },
        'clean': {
            files: '_book'
        }
    });

    grunt.registerTask('publish', [
        'gh-pages',
        'clean'
    ]);
};
