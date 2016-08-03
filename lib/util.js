'use strict';

var xml2js = require('xml2js');

exports.generateNonceString = function(length){
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    , len = chars.length
    , nonceStr = '';
  for (var i = 0; i < (length || 32); i++) {
    nonceStr += chars.charAt(Math.floor(Math.random() * len));
  }
  return nonceStr;
};

exports.getXML = function(json) {
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
};

exports.parseXML = function(str, callback) {
  var parser = new xml2js.Parser({trim: true, explicitArray: false, explicitRoot: false});
  parser.parseString(str, callback || function(){});
};
