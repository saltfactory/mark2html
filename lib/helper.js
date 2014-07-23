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
  this.createDirSync(path.dirname(src));

  try {
    fs.writeFileSync(src, data);
    logger.info(src + ' created!');
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
  this.createDirSync(path.dirname(src));
  fs.copy(src, dest, function (err) {
    if (err) {
      logger.error(err);
    } else {
      logger.info(dest + ' copied!');
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
  this.createDirSync(path.dirname(src));

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