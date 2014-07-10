/**
 * Created by saltfactory on 7/10/14.
 */



var fs = require('fs-extra');
var path = require('path');
var extend = require('util-extend');
var marked = require('marked');
var mime = require('mime');

var logger = require('tracer')
  .colorConsole(
  {
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
  markdownCopy:false,
  markdownDatauri:false
};

mark2html.queue = [];

/**
 * _readFileSync
 *
 * @param src
 * @returns {*}
 * @private
 */
function _readFileSync(src) {
  "use strict";
  var data = null;
  try {
    data = fs.readFileSync(src);
  } catch (e) {
    logger.error(e.message);
  }
  return data;
}

/**
 * _createDir
 *
 * @param src
 * @private
 */
function _createDir(src) {
  "use strict";
  if (!fs.existsSync(src)) {
    fs.mkdirpSync(src);
    logger.info('create directory: ' + src);
  }
}

/**
 * _createDest
 *
 * @param src
 * @param destDir
 * @returns {*}
 * @private
 */
function _createDest(src, destDir) {
  var ext = path.extname(src);
  var basename = path.basename(src, ext);
  var outputDir = path.join(destDir, basename);
  var out = path.join(outputDir, path.basename(src) + '.html');
  logger.debug(out);
  return out;
}

/**
 * _writeFile
 *
 * @param src
 * @param content
 * @private
 */
function _writeFile(src, content) {
  try {
    fs.writeFileSync(src, content);
    logger.info('created file : ' + src);
  } catch (e) {
    logger.error(e.message);
  }
}


/**
 * _copyFile
 *
 * @param src
 * @param dest
 * @private
 */
function _copyFile(src, dest) {
  fs.copy(src, dest, function (err) {
    if (err) {
      logger.error(err);
    } else {
      logger.info('copied file : ' + dest);
    }
  });
}

/**
 * _createDataUri
 *
 * @param src
 * @returns {string}
 * @private
 */
function _createDataUri(src) {
  var data = _readFileSync(src);
  var datauri = "data:" + mime.lookup(src) + ";base64," + data.toString('base64');
  return datauri;
}

/**
 * _copyFileSync
 *
 * @param src
 * @param dest
 * @returns {*}
 * @private
 */
function _copyFileSync(src, dest) {
  try {
    fs.copySync(src, dest);
    return path.basename(dest);
  } catch (e) {
    logger.error(e.message);
    return src;
  }
}

/**
 * _copyImageFileSync
 *
 * @param src
 * @param dest
 * @param isDataUri
 * @returns {*}
 * @private
 */
function _copyImageFileSync(src, dest, isDataUri) {
  if (isDataUri) {
    try {
      var data = fs.readFileSync(src);
      var datauri = _createDataUri(src, data);

      fs.writeFileSync(dest, data);
      return datauri;
    } catch (e) {
      logger.error(e.message);
      return dest;
    }
  } else {
    return _copyFileSync(src, dest);
  }
}


/**
 * createDestDir
 */
mark2html.createDestDir = function () {
  "use strict";
  if (this.options.subDir) {
    var ext = path.extname(this.options.src);
    var basename = path.basename(this.options.src, ext);
    var outputDir = path.join(this.options.destDir, basename);
    _createDir(outputDir);
  } else {
    _createDir(this.options.destDir);
  }
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
mark2html.rendHtml = function(item){
  var self = this;
  var renderer = new marked.Renderer();

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

  if (this.options.marked){
    options = extend(options, this.options.marked);
  }
//  var options = extend(this.options.marked, {renderer: renderer});


  marked.setOptions(options);

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
          replacedHref = _copyFileSync(href, path.join(outputDir, imageFileName));

        }

        if (self.options.datauri) {
          replacedHref = _createDataUri(href);
        }

      }
    }

    var out = '<img src="' + replacedHref + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += options.xhtml ? '/>' : '>';
//    logger.debug(href);


    return out;
  };

  var html = marked(item.data.toString());
  _createDir(path.dirname(item.dest));
  _writeFile(item.dest, html);
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
          replacedHref = _createDataUri(href);
        }
      }
    }


    return a + replacedHref + c;
  });
//  logger.debug(content);
  var dest = path.join(path.dirname(item.dest), path.basename(item.src));
  _writeFile(dest, content);
};

/**
 * cnovert
 *
 * @param options
 */
mark2html.convert = function (options) {
  "use strict";
  var json, settingsPath;

  try {

    //TODO: window 경로 지원하기
    settingsPath = path.join(process.env.HOME, '.mark2html.json');
    json = JSON.parse(fs.readFileSync(settingsPath).toString());

  } catch (e) {
    //TODO: 설정파일이 없을 때 default 설정 파일 저장시켜주기
    if (e.code === 'ENOENT') {
      logger.error(e.message);
    }
  }
  //전역 설정 파일을 로드하여 적용하기
  this.options = extend(this.options, json);

  //새로운 설정 값을 적용하기
  this.options = extend(this.options, options);
  logger.debug(options);

  //source 값 확인
  if ((this.options.src != null) && (this.options.srcDir == null)) {
    // single markdown
    // 데이터 큐에 추가
    this.queue.push({
        src: this.options.src,
        data: _readFileSync(this.options.src),
        dest: _createDest(this.options.src, this.options.destDir)
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

mark2html.test = function(args){
  console.log(args);
}


