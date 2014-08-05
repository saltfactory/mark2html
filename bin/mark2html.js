#!/usr/bin/env node

"use strict";
var path = require('path'),
  fs = require('fs'),
  lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib'),
  util = require('util'),
  mark2html = require(lib + '/mark2html.js'),
  logger = require(lib + '/logger.js'),
  nopt = require("nopt");


var knownOpts = { "src": path, "dest": path, "md": Boolean, "img": Boolean, "datauri": Boolean, "mdatauri": Boolean, "cfg": path, "opt": String, "code":Number, "style":Boolean, "skip-front-matter":Boolean};
var shortHands = { "s": ["-src"], "d": ["-dest"]};
var parsed = nopt(knownOpts, shortHands, process.argv, 1);
var options = {};


logger.print("*** start mark2html ***\n");

var defaultCfg = path.join(process.env.HOME, '.mark2html.json');

if (!fs.existsSync(defaultCfg)){
  logger.warn('Not found global options file! mark2html go on with default options');
  logger.print("[Solution] You do create global options file. e.g. echo \"{'destDir':'/output'}\" > " + defaultCfg);
}

if (parsed.cfg) {
  if(!fs.existsSync(parsed.cfg)){
    logger.warn('Not found global options file! mark2html go on with default options');
    logger.print("[Solution] You do create global options file. e.g. echo \"{'destDir':'/output'}\" > " + defaultCfg);
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

if (parsed.mdatauri) {
  options = util._extend(options, {markdownDatauri: parsed.mdatauri});
}

if (parsed.code) {
  options = util._extend(options, {highlight: parsed.code});
}

if (parsed.style) {
  options = util._extend(options, {imageStyle: parsed.style});
}

if (parsed["skip-front-matter"]) {
  options = util._extend(options, {skipFrontMatter: parsed["skip-front-matter"]})
}


mark2html.convert(options);
logger.print("*** end mark2html ***\n");