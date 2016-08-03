'use strict';

var request = require('request')
  , md5 = require('md5')
  , util = require('./util');

var WECHAT_HOST = 'https://api.mch.weixin.qq.com';

var WeChatPay = function(cfg) {
  this.cfg = cfg || {};

  return this;
};

WeChatPay.prototype.checkOptions = function(options, properties) {
  if (!this.cfg || !this.cfg.appid || !this.cfg.mch_id)
    throw new Error('Initialize first!');

  properties.forEach(function(prop) {
    if (options[prop] == undefined)
      throw new Error('Missing parameter: ' + prop);
  });
};

WeChatPay.prototype.setAppId = function(options) {
  options.appid = this.cfg.appid;
  options.mch_id = this.cfg.mch_id;
};

WeChatPay.prototype.setAppIdForTransfer = function(options) {
  options.mch_appid = this.cfg.appid;
  options.mchid = this.cfg.mch_id;
};

WeChatPay.prototype.getSign = function(options) {
  var qs = Object.keys(options).filter(function(key) {
    return options.hasOwnProperty(key) && options[key] !== undefined && options[key] !== ''
      && ['key', 'partner_key', 'pfx', 'sign', '_url'].indexOf(key) < 0;
  }).sort().map(function(key) {
    return key + '=' + options[key];
  }).join('&');

  qs += '&key=' + this.cfg.partner_key;

  return md5(qs).toUpperCase();
};

WeChatPay.prototype.request = function(options, callback) {
  var url = options._url;
  delete options._url;

  options.nonce_str = options.nonce_str || util.generateNonceString();
  options.sign = this.getSign(options);

  request.post({
    url: url,
    body: util.getXML(options),
    agentOptions: {
      pfx: this.cfg.pfx,
      passphrase: this.cfg.mch_id
    }
  }, function(err, response, body){
    if (err) return callback(err);

    return util.parseXML(body, callback);
  });
};

/**
 * wechatpay /unifedorder
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1
 * @param options
 * @param callback
 */
WeChatPay.prototype.createUnifiedOrder = function(options, callback) {
  try {
    this.checkOptions(options, ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url', 'product_id']);
  } catch (e) {
    return callback(e);
  }

  this.setAppId(options);
  options._url = WECHAT_HOST + '/pay/unifiedorder';
  this.request(options, callback);
};

/**
 * wechatpay /orderquery
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_2
 * @param options
 * @param callback
 */
WeChatPay.prototype.queryOrder = function(options, callback){
  if (!options.transaction_id && !options.out_trade_no)
    return callback(new Error('Invalid parameters!'));

  this.setAppId(options);
  options._url = WECHAT_HOST + '/pay/orderquery';
  this.request(options, callback);
};

/**
 * wechatpay /closeorder
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_3
 * @param options
 * @param callback
 */
WeChatPay.prototype.closeOrder = function(options, callback){
  if (!options.out_trade_no)
    throw new Error('Invalid parameters!');

  this.setAppId(options);
  options._url = WECHAT_HOST + '/pay/closeorder';
  this.request(options, callback);
};

/**
 * wechatpay /refund
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_4
 * @param options
 * @param callback
 */
WeChatPay.prototype.refund = function(options, callback){
  try {
    this.checkOptions(options, ['out_refund_no', 'total_fee', 'refund_fee']);
  } catch (e) {
    return callback(e);
  }
  if (!options.transaction_id && !options.out_trade_no)
    throw new Error('Invalid parameters!');

  options.op_user_id = options.op_user_id || this.cfg.mch_id;

  this.setAppId(options);
  options._url = WECHAT_HOST + '/secapi/pay/refund';
  this.request(options, callback);
};

/**
 * wechatpay transfer to someone
 * https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2
 * @param options
 * @param callback
 */
WeChatPay.prototype.transfer = function(options, callback) {
  try {
    this.checkOptions(options, ['partner_trade_no', 'openid', 'amount', 'desc', 'spbill_create_ip']);
  } catch (e) {
    return callback(e);
  }
  options.check_name = options.check_name || 'NO_CHECK';

  this.setAppIdForTransfer(options);
  options._url = WECHAT_HOST + '/mmpaymkttransfers/promotion/transfers';
  this.request(options, callback);
};

exports.WeChatPay = WeChatPay;
