/**
 * Created by saltfactory on 7/15/14.
 */
var util = require('util'),
  tracer = require('tracer')
    .colorConsole(
    {
      level: 'warn',
      format: [
        "{{timestamp}} (in {{file}}:{{line}}) <{{title}}> {{message}} ", //default format
        {
          error: "{{timestamp}} (in {{file}}:{{line}}) <{{title}}> {{message}} \nCall Stack:\n{{stack}}" // error format
        }
      ],
      dateformat: "HH:MM:ss.L",
      preprocess: function (data) {
        data.title = data.title.toUpperCase();
      }
    });

//module.exports = tracer;
exports.locale = 'en';
exports.print = console.log;
exports.inspect = util.inspect;
exports.log = tracer.log;
exports.info = tracer.info;
exports.debug = tracer.debug;
exports.trace = tracer.trace;
exports.warn = tracer.warn;
exports.error = function(err){
  util.error('\n[ERROR]:'+ err + '\n');
  util.error("*** abort mark2html ***\n");
  process.exit();
}


exports.exception = tracer.error;

