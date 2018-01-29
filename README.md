# node-wechatpay

WeChatPay library for nodejs

[![Build Status](https://travis-ci.org/flitto/wechatpay.svg?branch=master)](https://travis-ci.org/flitto/wechatpay)
<span class="badge-npmversion"><a href="https://npmjs.org/package/wechatpay" title="View this project on NPM"><img src="https://img.shields.io/npm/v/wechatpay.svg" alt="NPM version" /></a></span>


## WeChatPay Document

* [WeChatPay Document](https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1)


## Installation

```sh
npm install wechatpay
```

## Usage

```javascript
const fs = require('fs');
const WeChatPay = require('wechatpay').WeChatPay;

const wpay = new WeChatPay({
  appid: 'xxx',
  mch_id: 'xxx',
  partner_key: 'xxx',
  pfx: fs.readFileSync('./apiclient_cert.p12')
});

// /pay/unifiedorder
wpay.createUnifiedOrder({
  body: 'Product Name',
  out_trade_no: new Date().getTime() + Math.random().toString().substr(2, 6),
  total_fee: 100,   // 1 yuan
  spbill_create_ip: '8.8.8.8',
  notify_url: 'http://8.8.8.8',
  trade_type: 'NATIVE',
  product_id: '1234567890'
}, function(err, result){
  console.log(result);
});

// /pay/unifiedorder with QR SVG string
wpay.createUnifiedOrder({
  body: 'Product Name',
  out_trade_no: new Date().getTime() + Math.random().toString().substr(2, 6),
  total_fee: 100,   // 1 yuan
  spbill_create_ip: '8.8.8.8',
  notify_url: 'http://8.8.8.8',
  trade_type: 'NATIVE',
  product_id: '1234567890',
  code_svg: true
}, function(err, result){
  console.log(result);  // result.code_svg - QR SVG string
});

// /pay/unifiedorder with trade_type='APP'
wpay.createUnifiedOrder({
  body: 'Product Name',
  out_trade_no: new Date().getTime() + Math.random().toString().substr(2, 6),
  total_fee: 100,   // 1 yuan
  spbill_create_ip: '8.8.8.8',
  notify_url: 'http://8.8.8.8',
  trade_type: 'APP',
  product_id: '1234567890'
}, function(err, result){
  console.log(result);  // result.app_sign - sign string with prepay_id for WeChat App
                        // result.timestamp - signing timestamp for above app_sign
});

// /pay/orderquery
wpay.queryOrder({
  out_trade_no: 'xxx'
}, function(err, result){
  console.log(result);
});

// /pay/closeorder
wpay.closeOrder({
  out_trade_no: 'xxx'
}, function(err, result){
  console.log(result);
});

// /secapi/pay/refund
wpay.refund({
  out_trade_no: 'xxx',
  out_refund_no: 'yyy',
  total_fee: 100,
  refund_fee: 100,
  op_user_id: 'zzz'
}, function(err, result){
  console.log(result);
});

// /mmpaymkttransfers/promotion/transfers
wpay.transfer({
  partner_trade_no: 'xxx',
  openid: 'yyy',
  check_name: 'NO_CHECK',
  amount: 100,
  desc: 'memo',
  spbill_create_ip: '8.8.8.8'
}, function(err, result){
  console.log(result);
});
```
