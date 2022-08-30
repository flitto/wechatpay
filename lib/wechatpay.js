const { Client } = require('undici')
const md5 = require('md5')
const util = require('./util')

const WECHAT_HOST = 'https://api.mch.weixin.qq.com'

const WeChatPay = function (cfg) {
  this.cfg = cfg || {}

  return this
}

WeChatPay.prototype.checkOptions = function (options, properties) {
  if (!this.cfg || !this.cfg.appid || !this.cfg.mch_id)
    throw new Error('Initialize first!')

  properties.forEach((prop) => {
    if (options[prop] === undefined)
      throw new Error('Missing parameter: ' + prop)
  })
}

WeChatPay.prototype.setAppId = function (options) {
  options.appid = this.cfg.appid
  options.mch_id = this.cfg.mch_id
}

WeChatPay.prototype.setAppIdForTransfer = function (options) {
  options.mch_appid = this.cfg.appid
  options.mchid = this.cfg.mch_id
}

WeChatPay.prototype.getSign = function (options) {
  let qs = Object.keys(options)
    .filter((key) => {
      return options.hasOwnProperty(key) && options[key] !== undefined && options[key] !== '' &&
        ['key', 'partner_key', 'pfx', 'sign', '_url', 'code_svg'].indexOf(key) < 0
    })
    .sort()
    .map((key) => `${key}=${options[key]}`).join('&')

  qs += `&key=${this.cfg.partner_key}`

  return md5(qs).toUpperCase()
}

WeChatPay.prototype.request = async function (options, callback) {
  try {
    const url = new URL(options._url)
    delete options._url
    delete options.code_svg

    options.nonce_str = options.nonce_str || util.generateNonceString()
    options.sign = this.getSign(options)

    const tls = {
      pfx: this.cfg.pfx,
      passphrase: this.cfg.mch_id
    }
    const client = new Client(url.origin, { connect: tls })

    const { body } = await client.request({
      method: 'POST',
      path: url.pathname,
      body: util.getXML(options)
    })
    const text = await body.text()
    const json = await util.parseXML(text)

    if (callback) return callback(null, json)
    return json
  } catch (e) {
    if (callback) return callback(e)
    throw e
  }
}

const handleError = function (err, callback) {
  if (callback) return callback(err)
  else throw err
}

/**
 * wechatpay /unifedorder
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1
 * @param options
 * @param options.code_svg - If it is true, callback data has qr code svg data.
 * @param [callback]
 */
WeChatPay.prototype.createUnifiedOrder = async function (options, callback) {
  try {
    this.checkOptions(options, ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url', 'product_id'])
  } catch (e) {
    return handleError(e, callback)
  }

  const opt = { ...options }
  this.setAppId(opt)
  opt._url = WECHAT_HOST + '/pay/unifiedorder'
  try {
    const data = await this.request(opt)

    if (options.code_svg && data.code_url)
      data.code_svg = util.getQRSvg(data.code_url)

    if (opt.trade_type === 'APP') {
      const o = {
        appid: opt.appid,
        partnerid: opt.mch_id,
        noncestr: data.nonce_str,
        package: 'Sign=WXPay',
        prepayid: data.prepay_id,
        timestamp: parseInt(new Date().getTime() / 1000)
      }
      data.app_sign = this.getSign(o)
      data.timestamp = o.timestamp
    }
    if (callback) return callback(null, data)
    return data
  } catch (err) {
    handleError(err, callback)
  }
}

/**
 * wechatpay /orderquery
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_2
 * @param options
 * @param [callback]
 */
WeChatPay.prototype.queryOrder = function (options, callback) {
  if (!options.transaction_id && !options.out_trade_no) return handleError(new Error('Invalid parameters!'), callback)

  const opt = { ...options }
  this.setAppId(opt)
  opt._url = WECHAT_HOST + '/pay/orderquery'
  return this.request(opt, callback)
}

/**
 * wechatpay /closeorder
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_3
 * @param options
 * @param [callback]
 */
WeChatPay.prototype.closeOrder = function (options, callback) {
  if (!options.out_trade_no) return handleError(new Error('Invalid parameters!'), callback)

  const opt = { ...options }
  this.setAppId(opt)
  opt._url = WECHAT_HOST + '/pay/closeorder'
  this.request(opt, callback)
}

/**
 * wechatpay /refund
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_4
 * @param options
 * @param [callback]
 */
WeChatPay.prototype.refund = function (options, callback) {
  try {
    this.checkOptions(options, ['out_refund_no', 'total_fee', 'refund_fee'])
  } catch (e) {
    return handleError(e, callback)
  }
  if (!options.transaction_id && !options.out_trade_no) return handleError(new Error('Invalid parameters!'), callback)

  const opt = { ...options }
  opt.op_user_id = opt.op_user_id || this.cfg.mch_id

  this.setAppId(opt)
  opt._url = WECHAT_HOST + '/secapi/pay/refund'
  return this.request(opt, callback)
}

/**
 * wechatpay /refundQuery
 * doc: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_5
 * @param options
 * @param [callback]
 * @returns {*}
 */
WeChatPay.prototype.refundQuery = function (options, callback) {
  if (!options.refund_id && !options.out_refund_no && !options.transaction_id && !options.out_trade_no) {
    return handleError(new Error('Invalid parameters!'), callback)
  }

  const opt = { ...options }
  this.setAppId(opt)
  opt._url = WECHAT_HOST + '/pay/refundquery'
  return this.request(opt, callback)
}

/**
 * wechatpay transfer to someone
 * https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2
 * @param options
 * @param [callback]
 */
WeChatPay.prototype.transfer = function (options, callback) {
  try {
    this.checkOptions(options, ['partner_trade_no', 'openid', 'amount', 'desc', 'spbill_create_ip'])
  } catch (e) {
    return handleError(e, callback)
  }
  const opt = { ...options }
  opt.check_name = opt.check_name || 'NO_CHECK'

  this.setAppIdForTransfer(opt)
  opt._url = WECHAT_HOST + '/mmpaymkttransfers/promotion/transfers'
  return this.request(opt, callback)
}

exports.WeChatPay = WeChatPay
