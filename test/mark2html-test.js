/**
 * Created by saltfactory on 7/10/14.
 */
var mark2html = require('../lib/mark2html');

var options = {
  src:'/Users/saltfactory/Dropbox/Blog/posts/2014-07-16-create-passport-tistory.md',
  destDir:'/Users/saltfactory/Dropbox/Blog/output',
  imageCopy:true,
  datauri:true,
  markdownCopy:true,
  markdownDatauri:false,
  highlight: 1, //0:false, 1:default(pygments), 2:higlight.js
  marked:{
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: true
  }
}
mark2html.convert(options);
