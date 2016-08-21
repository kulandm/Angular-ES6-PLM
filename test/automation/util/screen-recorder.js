/**
 * @ngdoc object
 * @name ViewTestsUtil.screen-recorder
 *
 * @description This is the helper for screen recording.
 * The screen recorder behavior is controlled by 2 environment variables:
 * - SCREENCAST_DIR - determine where the screencast files are saved.
 * - SCREENCAST_SAVE_PASSED - weather saving screencast for passed tests.
 *
 * ##Dependencies
 *
 */
var fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

module.exports = function (test) {
    var api = Object.create(null),
        movieFile,
        recordingDir = '~/', // process.env.SCREENCAST_DIR,
        recorder;

    api.start = function (done) {
        if (recordingDir) {
            movieFile = path.join(recordingDir, test.fullTitle() + '.mov');
            recorder = spawn('ffmpeg', ['-y', '-r', '30', '-g', '300',
                '-f', 'x11grab',
                '-s', '1024x768',
                '-i', process.env.DISPLAY,
                '-vcodec', 'qtrle', movieFile]);
        }
        done();
    };

    api.stop = function (done) {
        if (recordingDir) {
            if (recorder) {
                recorder.kill();
            }

            if (test.state === 'passed' && !process.env.SCREENCAST_SAVE_PASSED) {
                fs.unlink(movieFile, done);
            } else {
                done();
            }
        } else {
            done();
        }
    };

    return api;
};
