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
exports.print = util.print;
exports.inspect = util.inspect;
exports.log = tracer.log;
exports.info = tracer.info;
exports.debug = tracer.debug;
exports.trace = tracer.trace;
exports.warn = tracer.warn;
exports.error = function(err){
  util.error(err);
  util.print("*** abort mark2html ***");
  process.exit();
}


exports.exception = tracer.error;

