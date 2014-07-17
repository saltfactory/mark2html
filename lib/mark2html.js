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
  pygmentize = require('pygmentize-bundled')

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
  highlgiht: 0
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
  this.rendHtml(item);

  // save rended markdown file
  if (this.options.markdownCopy) {
    this.rendMarkdown(item);
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
  renderer.code =  function (code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    return (escaped ? code : this.escape(code, true));
  };


  var options = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: true,
    renderer: renderer
  }

  if (this.options.marked) {
    options = util._extend(options, this.options.marked);
  }

  if (this.options.highlight){
    if (this.options.highlight == 1){


      options.highlight = function (code, lang, callback) {

//        console.log(lang);
        var cssclass = (lang) ? 'highlight highlight-' + lang : 'highlight';
        pygmentize({ lang: lang, format: 'html', options: { cssclass:cssclass } }, code, function (err, result) {
//          console.log(result.toString());
          callback(err, result.toString());
        });
      };
    } else {
      options.highlight = function(code){
        return highlight.highlightAuto(code).value;
      };
    }
  }

  marked.setOptions(options);

  renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '-');
    return '<h' + level + ' id="' + escapedText + '">' + text + '</h' + level + '>';
  };

  renderer.image = function (href, title, text) {
    var replacedHref = href;

    if (self.options.imageCopy || self.options.datauri) {
      // imguri가 http나 https, data:base64가 아닐경우 아닐경우
      if ((href.indexOf('http://') == -1)
        && (href.indexOf('https://') == -1)
        && (href.indexOf("data:") == -1)) {

        if (self.options.imageCopy) {
          var outputDir = path.dirname(item.dest);
          var imageFileName = path.basename(href);
          replacedHref = helper.copyFileSync(href, path.join(outputDir, imageFileName));

        }

        if (self.options.datauri) {
          replacedHref = helper.createDataUri(href);
        }

      }
    }

    var out = '<img src="' + replacedHref + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += options.xhtml ? '/>' : '>';

    return out;
  };


  if (item.data !== null) {
    if (this.options.highlight){
      if (this.options.highlight == 1){
        marked(item.data.toString(), function (err, html) {
//          logger.print(html);
          if (err) {
            logger.error(err)
          } else {
            helper.createDirSync(path.dirname(item.dest));
            helper.writeFileSync(item.dest, html);
          }
        });
      } else {
        var html = marked(item.data.toString());
        helper.createDirSync(path.dirname(item.dest));
        helper.writeFileSync(item.dest, html);
      }
    }



  } else {
    console.log(item.data);
  }
};

/**
 * rendMarkdown
 *
 * @param item
 */
mark2html.rendMarkdown = function (item) {
  var self = this;
  var content = item.data.toString();
  content = content.replace(/(!\[.*?\]\()(.+?)(\))/g, function (whole, a, href, c) {
    var replacedHref = href;

    if (self.options.imageCopy || self.options.markdownDatauri) {
      if ((href.indexOf('http://') == -1)
        && (href.indexOf('https://') == -1)
        && (href.indexOf("data:") == -1)) {

        if (self.options.imageCopy) {
          replacedHref = path.basename(href);
        }

        if (self.options.markdownDatauri) {
          replacedHref = helper.createDataUri(href);
        }
      }
    }


    return a + replacedHref + c;
  });
//  logger.debug(content);
  var dest = path.join(path.dirname(item.dest), path.basename(item.src));
  helper.writeFileSync(dest, content);
};

/**
 * cnovert
 *
 * @param options
 */
mark2html.convert = function (options) {
  "use strict";
  var json, settingsPath;


  //디폴트 설정파일 로드하기
  //TODO: window 경로 지원하기
  settingsPath = path.join(process.env.HOME, '.mark2html.json');
  if (fs.existsSync(settingsPath)) {
    json = JSON.parse(fs.readFileSync(settingsPath).toString());
  }

  //전역 설정 파일을 로드하여 적용하기
  this.options = util._extend(this.options, json);

  //새로운 설정 값을 적용하기
  this.options = util._extend(this.options, options);

  logger.print("-- mark2html 설정값 --\n");
  logger.print(JSON.stringify(options, null, 2) + "\n");

  //source 값 확인
  if ((this.options.src != null) && (this.options.srcDir == null)) {
    // single markdown
    // 데이터 큐에 추가
    this.queue.push({
        src: this.options.src,
        data: helper.readFileSync(this.options.src),
        dest: this.createDest(this.options.src, this.options.destDir)
      }
    );

  } else if ((this.options.src == null) && (this.options.srcDir != null)) {
    //TODO: mardkown 폴더 지정 구현
    //multiple markdowns
  }

  // render
  var self = this;
  this.queue.forEach(function (item) {
    self.render(item);
  });

};

