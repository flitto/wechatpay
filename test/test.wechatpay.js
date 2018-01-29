const should = require('should');
const WeChatPay = require('../lib/wechatpay').WeChatPay;

describe('wechatpay test cases:', function() {

  const wpay = new WeChatPay({appid: 'xxxxx', mch_id: 'xxxxx'});

  it('call createUnifiedOrder() without initializing', function(done) {
    const pay = new WeChatPay();
    pay.createUnifiedOrder({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

  it('call createUnifiedOrder() with no parameter', function(done) {
    wpay.createUnifiedOrder({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

  it('call queryOrder() with no parameter', function(done) {
    wpay.queryOrder({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

  it('call closeOrder() with no parameter', function(done) {
    wpay.closeOrder({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

  it('call refund() with no parameter', function(done) {
    wpay.refund({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

  it('call transfer() with no parameter', function(done) {
    wpay.transfer({}, function(err, data) {
      should.exist(err);
      done();
    });
  });

});
