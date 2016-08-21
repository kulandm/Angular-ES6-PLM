module.exports = {// Configuration for building angular templates files to build directory.
    'plm360': {
        cwd: 'app',
        src: ['build/**/**.html','components/**/**.html','partials/**/**.html','templates/**/**.html'],
        dest: '<%=buildPath%>/templates.js',
        options: {
            htmlmin: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true
            }
        }
    }
};
