/**
 * Created by saltfactory on 7/10/14.
 */
var mark2html = require('../lib/mark2html');
//var options = {}
var options = {
  "content": null,
  "src": "/Users/saltfactory/Dropbox/Blog/posts/2014-08-05-mark2html-v.0.0.5-upgrade.md",
  "srcDir": null,
  "dest": null,
  "destDir": "/Users/saltfactory/Dropbox/Blog/output",
  "subDir": true,
  "imageCopy": true,
  "datauri": true,
  "markdownCopy": true,
  "markdownDatauri": false,
  "highlight": 1,
  "imageStyle": false,
  "skipFrontMatter": false
//  src:'/Users/saltfactory/Dropbox/Blog/posts/2014-07-22-migrate-git-repository.md',
//  destDir:'/Users/saltfactory/Dropbox/Blog/output',
//  imageCopy:true,
//  datauri:true,
//  markdownCopy:false,
//  markdownDatauri:true,
//  highlight: 1, //0:false, 1:default(pygments), 2:higlight.js
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
}
mark2html.convert(options);
