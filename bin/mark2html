#!/usr/bin/env node

"use strict";
var path = require('path'),
  fs = require('fs'),
  lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib'),
  util = require('util'),
  mark2html = require(lib + '/mark2html.js'),
  logger = require(lib + '/logger.js'),
  nopt = require("nopt");


var knownOpts = { "src": path, "dest": path, "md": Boolean, "img": Boolean, "datauri": Boolean, "cfg": path, "opt": String, "code":Number};
var shortHands = { "s": ["-src"], "d": ["-dest"]};
var parsed = nopt(knownOpts, shortHands, process.argv, 1);
var options = {};


logger.print("*** start mark2html ***\n");

var defaultCfg = path.join(process.env.HOME, '.mark2html.json');

if (!fs.existsSync(defaultCfg)){
  logger.error('디폴트 설정파일 ' + defaultCfg + ' 이 존재하지 않습니다. 기본 설정으로 진행합니다.');
}

if (parsed.cfg) {
  if(!fs.existsSync(parsed.cfg)){
    logger.error(parsed.cfg + " 설정파일이 존재하지 않습니다. 기본 설정으로 진행합니다.");
  } else {
    options = util._extend(options, JSON.parse(fs.readFileSync(parsed.cfg)));
  }
}

if (parsed.opt) {
  var json;
  try {
    json = JSON.parse(parsed.opt);
    options = util._extend(options, json);
  } catch (e){
    logger.error(e.message);
  }
}

if (parsed.md) {
  options = util._extend(options, {markdownCopy: parsed.md});
}

if (parsed.img) {
  options = util._extend(options, {imageCopy: parsed.img});
}

if (parsed.dest) {
  options = util._extend(options, {destDir: parsed.dest});
}

if (parsed.src) {
  options = util._extend(options, {src: parsed.src});
}

if (parsed.datauri) {
  options = util._extend(options, {datauri: parsed.datauri});
}

if (parsed.code) {
  options = util._extend(options, {highlight: parsed.code});
}


mark2html.convert(options);
logger.print("*** end mark2html ***\n");