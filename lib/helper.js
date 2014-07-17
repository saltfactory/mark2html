/**
 * Created by saltfactory on 7/16/14.
 */
var logger = require('./logger'),
  path = require('path'),
  fs = require('fs-extra'),
  util = require('util'),
  mime = require('mime');


/**
 * readFileSync
 * 파일을 읽어서 data로 변환하여 넘겨준다.
 *
 * @param src
 * @returns {*}
 */
exports.readFileSync = function (src) {
  var data = null;

  if (!fs.existsSync(src)) {
    logger.error(src + ' not found!');
  } else {
    try {
      data = fs.readFileSync(src);
    } catch (e) {
      util.error(e.message);
    }
    return data;
  }
};

/**
 * createDirSync
 *
 * @param src
 */
exports.createDirSync = function (src) {
  if (!fs.existsSync(src)) {
    fs.mkdirpSync(src);
    logger.info('create directory: ' + src);
  }
};

/**
 * writeFileSync
 *
 * @param src
 * @param data
 */
exports.writeFileSync = function (src, data) {
  try {
    fs.writeFileSync(src, data);
    logger.info(src + '파일을 생성하였습니다.');
  } catch (e) {
    logger.error(e.message);
  }
};

/**
 * copyFileSync
 *
 * @param src
 * @param dest
 */
exports.copyFile = function (src, dest) {
  fs.copy(src, dest, function (err) {
    if (err) {
      logger.error(err);
    } else {
      logger.info('copied file : ' + dest);
    }
  })
};

/**
 * copyFileSync
 *
 * @param src
 * @param dest
 * @returns {*}
 */
exports.copyFileSync = function (src, dest) {
  try {
    fs.copySync(src, dest);
    return path.basename(dest);
  } catch (e) {
    logger.error(e.message);
    return src;
  }
};

exports.createDataUri = function(src){
  var data = this.readFileSync(src);
  var datauri = "data:" + mime.lookup(src) + ";base64," + data.toString('base64');
  return datauri;
};