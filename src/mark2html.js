#!/usr/bin/env node

"use strict";
var path = require('path');
var fs = require('fs');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var extend = require('util-extend');

var mark2html = require(lib+'/mark2html.js')
var nopt = require("nopt")
  , path = require("path")
  , knownOpts = { "src" : path, "dest":path, "md":Boolean, "img":Boolean, "datauri":Boolean, "cfg":path, "opt":String}
//  , knownOpts = { "src" : [path, Array], "dest":path, "md":Boolean, "img":Boolean, "datauri":Boolean, "cfg":path, "opt":String}
  , shortHands = { "s" : ["-src"], "d": ["-dest"]}
  , parsed = nopt(knownOpts, shortHands, process.argv, 1)
//console.log(parsed.opt)


var options ={};


if (parsed.cfg){
  options = extend(options, JSON.parse(fs.readFileSync(parsed.cfg)));
}

if (parsed.opt){
 options = extend(options, JSON.parse(parsed.opt));
}

if (parsed.md){
  options = extend(options, {markdownCopy:parsed.md});
}

if (parsed.img){
  options = extend(options, {imageCopy:parsed.img});
}

if (parsed.dest){
  options = extend(options, {destDir:parsed.dest});
}

if (parsed.src){
  options = extend(options, {src:parsed.src});
}



console.log(options)
//var options = {
//  src:'/Projects/Blogs/blog.saltfactory.net/_posts/2014-07-07-create-tistory-editor-package-in-atom-editor.md',
//  destDir:'/Users/saltfactory/Dropbox/Blog/output',
//  imageCopy:true,
//  datauri:true,
//  markdownCopy:true,
//  markdownDatauri:false,
//  marked:{
//    gfm: true,
//    tables: true,
//    breaks: false,
//    pedantic: false,
//    sanitize: true,
//    smartLists: true,
//    smartypants: false,
//    xhtml: true
//  }
//}
mark2html.convert(options);