/**
 * Created by saltfactory on 7/10/14.
 */



var fs = require('fs-extra'),
  path = require('path'),
  util = require('util'),
  marked = require('marked'),
  helper = require('./helper'),
  logger = require('./logger'),
  highlight = require('highlight.js'),
  pygmentize = require('pygmentize-bundled'),
  asyncReplace = require('async-replace'),
  Gallery3 = require('node-gallery3');

var mark2html = exports;

mark2html.options = {
  content: null,
  src: null,
  srcDir: null,
  dest: null,
  destDir: null,
  subDir: true,
  imageCopy: false,
  datauri: false,
  markdownCopy: false,
  markdownDatauri: false,
  highlgiht: 0,
  imageStyle: false,
  skipFrontMatter: false,
  marked: {

    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: true
  }
};

mark2html.queue = [];

mark2html.createDest = function (src, destDir) {
  var ext = path.extname(src);
  var basename = path.basename(src, ext);
  var outputDir = path.join(destDir, basename);
  var out = path.join(outputDir, path.basename(src) + '.html');

  return out;
};

/**
 * render
 * @param item
 */
mark2html.render = function (item) {

  // save rended html file
  //this.rendHtml(item);

  // save rended markdown file
  if (this.options.markdownCopy) {
    this.rendMarkdown(item);
  } else {
    this.rendHtml(item);
  }
};

/**
 * rendHtml
 *
 * @param item
 */
mark2html.rendHtml = function (item) {
  var self = this;
  var renderer = new marked.Renderer();

  function escape(html, encode) {
    return html
      .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/-/g, '&mdash;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  renderer.code = function (code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    return (escaped ? code : escape(code, true));
  };


//  var options = {
//    gfm: true,
//    tables: true,
//    breaks: false,
//    pedantic: false,
//    sanitize: true,
//    smartLists: true,
//    smartypants: false,
//    xhtml: true,
//    renderer: renderer
//  }

//  if (this.options.marked) {
  this.options.marked.renderer = renderer;
//  options = util._extend(options, this.options.marked);

//  }

  if (this.options.highlight) {

    // 1: pygmentize-bundled is async mode
    if (this.options.highlight == 1) {
      this.options.marked.highlight = function (code, lang, callback) {

        var cssclass = (lang) ? 'highlight highlight-' + lang : 'highlight';
        pygmentize({ lang: lang, format: 'html', options: { cssclass: cssclass } }, code, function (err, result) {
//          console.log(code);
          callback(err, result.toString());
        });
      };
    } else {
      // 2: highlight.js is sync mode
      this.options.marked.highlight = function (code) {
        return highlight.highlightAuto(code).value;
      };
    }
  }

  marked.setOptions(this.options.marked);

  renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '-');
    return '<h' + level + ' id="' + escapedText + '">' + text + '</h' + level + '>';
  };

  renderer.image = function (href, title, text) {
    var replacedHref = href;


    if(self.options.markdownCopy){

    } else {
      if (self.options.imageCopy || self.options.datauri) {
        //logger.debug(item);
        if ((href.indexOf('http://') == -1)
          && (href.indexOf('https://') == -1)
          && (href.indexOf("data:") == -1)) {

          if (self.options.imageCopy) {
            var outputDir = path.dirname(item.dest);
            var imageFileName = path.basename(href);

            helper.copyFileSync(href, path.join(outputDir, 'images', imageFileName));
            replacedHref = path.join('images', imageFileName);
            //logger.debug(href);
          }

          if (self.options.datauri) {
            replacedHref = helper.createDataUri(href);
          }

        }
      }
    }

    var out = '<img src="' + replacedHref + '"';

    if (self.options.imageStyle) {
      text = text.replace(/{(.+?)}/g, function (mather, style, poisition, fulltext) {

        out += ' style="' + style + '"';

        return ''
      });
    }

    out += ' alt="' + text + '"';

    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';


    return out;
  };

//  logger.debug(item.data);

  if (item.data !== null) {
//    if (this.options.highlight) {
//    var content = item.data.toString();

    if (this.options.highlight == 1) {
      // 1 : pygmentize-bundled is async mode
      marked(item.data, function (err, html) {
        if (err) {
          logger.error(err)
        } else {
          helper.createDirSync(path.dirname(item.dest));
          //helper.writeFileSync(item.dest, html);
          self.saveHTML(item.dest, html);
        }
      });
    } else {
      // 2: highlight.js is sync mode
      var html = marked(item.data);
      helper.createDirSync(path.dirname(item.dest));
      //helper.writeFileSync(item.dest, html);
      self.saveHTML(item.dest, html);
    }
  }
//  }

};

mark2html.saveHTML = function(dest, html){
  var self = this;
  if(self.options.gallery3) {
    var pattern = /(<img *src=")(?!http|data)(.*?)(")/g;

    function replacer(match, p1, href, p3, offset, intput, done) {

      var gallery3 = new Gallery3(self.options.gallery3);
      gallery3.uploadFile(href, {name: path.basename(href)}).success(function (result) {

        gallery3.getImageUrlPublic(result.url).success(function (imageUrl) {
          done(null, p1 + imageUrl + p3);
        });
      });

    }

    asyncReplace(html, pattern, replacer, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        helper.writeFileSync(dest, result);
      }

    });
  } else {
    //logger.debug(html);
    helper.writeFileSync(dest, html);
  }

}

/**
 * rendMarkdown
 *
 * @param item
 */
mark2html.rendMarkdown = function (item) {
  var self = this;

  function replacer(match, p1, href, p3, offset, intput, done){
    //logger.debug(match);
    //logger.debug(p1);
    //logger.debug(href);
    //logger.debug(p3);
    //logger.debug(offset);
    //logger.debug(string);
    //done(null, [p1, p2, p3].join(' - '));

    //logger.debug(href);

    if ((href.indexOf('http://') == -1)
        && (href.indexOf('https://') == -1)
        && (href.indexOf("data:") == -1)) {

        if (self.options.imageCopy){
          var targetFile = path.join(path.dirname(item.dest), 'images', path.basename(href));
          helper.copyFileSync(href, targetFile);
          var imageUrl = path.join('images', path.basename(href));

          if(!self.options.gallery3){
            done(null, p1 + imageUrl + p3);
          }
        }

        //logger.debug('local file')
        if(self.options.gallery3){
          var gallery3 = new Gallery3(self.options.gallery3);
          gallery3.uploadFile(href, {name: path.basename(href)}).success(function (result) {
            //logger.debug(result);
            gallery3.getImageUrlPublic(result.url).success(function (imageUrl) {
              done(null, p1 + imageUrl + p3);
            });
          });
        }

      //done(null, p1 + href + p3);
    } else {
      //logger.debug('remote file')
      done(null, p1 + href + p3);
    }

  }

  asyncReplace(item.data, /(!\[.*?\]\()(.+?)(\))/g, replacer, function(err, result) {
    //console.log(result);
    var dest = path.join(path.dirname(item.dest), path.basename(item.src));
    helper.writeFileSync(dest, result);

    item.src = dest;
    self.options.src = dest;
    item.data = result;
    //var data = helper.readFileSync(self.options.src).toString();
    self.rendHtml(item);
  });

};

/**
 * cnovert
 *
 * @param options
 */
mark2html.convert = function (options) {
  "use strict";
  var json, settingsPath;

  //TODO: Support Windows OS
  //load global options file
  settingsPath = path.join(process.env.HOME, '.mark2html.json');
  if (fs.existsSync(settingsPath)) {
    json = JSON.parse(fs.readFileSync(settingsPath).toString());
  }

  //extend options with global options file
  this.options = util._extend(this.options, json);

  //extend options with param options
  this.options = util._extend(this.options, options);

  if (this.options.src == null) {
    logger.error('"src" value is not exists!');
    logger.print('[solution 1.] If you used command line, with -src markdown file path. e.g. mark2html -s /example.md ')
    logger.print('[solution 2.] If you used node module, add "src" to option e.g. var option = {src:"/example.md"} ');
    logger.print('[solution 3.] If you have global options file, add "src" to option. e.g. {"src":"/example.md"} ');
  }

  if (this.options.destDir == null) {
    logger.error('"destDir" value is not exists!');
    logger.print('[solution 1.] If you used command line, with -d target folder path. e.g. mark2html -d /output')
    logger.print('[solution 2.] If you used node module, add "destDir" to option e.g. var option = {destDir:"/example.md"}');
    logger.print('[solution 3.] If you have global options file, add "destDir" to option. e.g. {"destDir":"/example.md"} ');

  }

  logger.print("-- Setting mark2html options!  --\n");
  logger.print(JSON.stringify(this.options, null, 2) + "\n");

  if ((this.options.src != null) && (this.options.srcDir == null)) {
    //single markdown

    var data = helper.readFileSync(this.options.src).toString();
    if (this.options.skipFrontMatter){
      var pattern = /---(.|\n)*---/;
      data = data.replace(pattern, "");
      logger.debug(data);
    }

    this.queue.push({
        src: this.options.src,
        data: data,
        dest: this.createDest(this.options.src, this.options.destDir)
      }
    );

  } else if ((this.options.src == null) && (this.options.srcDir != null)) {
    //TODO: Multiple Markdown files or Source folder
    //multiple markdowns
  }

  var self = this;
  this.queue.forEach(function (item) {
    self.render(item);
  });

};


