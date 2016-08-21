module.exports = {// Configuration for building angular templates files to build directory.
    'com/autodesk/wipFileBrowser.js': {
        cwd: 'src',
        src: ['**.html', 'breadcrumb/**.html'],
        dest: 'build/templates.js',
        options: {
            htmlmin: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true
            },
            bootstrap: function (module, script) {
                return 'System.get("' + module + '");angular.module("' + module + '").run(["$templateCache", function($templateCache) {' + script + '}]);';
            }
        }
    }
};
