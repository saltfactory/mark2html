/**
 * Created by saltfactory on 7/10/14.
 */
var mark2html = require('../lib/mark2html');
//var options = {}
var options = {
  "content": null,
  "src": "/Users/saltfactory/Dropbox/Blog/posts/2015-03-10-introduce-node-gallery3.md",
  "srcDir": null,
  "dest": null,
  "destDir": "/Users/saltfactory/Dropbox/Blog/output",
  "subDir": true,
  "imageCopy": true,
  "markdownCopy": true,
  //"gallery3":{
  //    "host":"http://localhost",
  //    "base":"/gallery3",
  //    "rootItemId":1,
  //    "requestKey":""
  //},
  "datauri": false,
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

