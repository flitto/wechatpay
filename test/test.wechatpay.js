const should = require('should')
const WeChatPay = require('../lib/wechatpay').WeChatPay

describe('wechatpay test cases:', function () {

  const wpay = new WeChatPay({ appid: 'xxxxx', mch_id: 'xxxxx' })

  it('call createUnifiedOrder() without initializing', async () => {
    const pay = new WeChatPay()
    try {
      await pay.createUnifiedOrder({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Initialize first!')
    }
  })

  it('call createUnifiedOrder() with no parameter', async () => {
    try {
      await wpay.createUnifiedOrder({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Missing parameter: body')
    }
  })

  it('call queryOrder() with no parameter', async () => {
    try {
      wpay.queryOrder({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Invalid parameters!')
    }
  })

  it('call closeOrder() with no parameter', async () => {
    try {
      await wpay.closeOrder({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Invalid parameters!')
    }
  })

  it('call refund() with no parameter', async () => {
    try {
      await wpay.refund({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Missing parameter: out_refund_no')
    }
  })

  it('call refundQuery() with no parameter', async () => {
    try {
      await wpay.refundQuery({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Invalid parameters!')
    }
  })

  it('call transfer() with no parameter', async () => {
    try {
      await wpay.transfer({})
      throw new Error('Unknown Error')
    } catch (e) {
      e.toString().should.equal('Error: Missing parameter: partner_trade_no')
    }
  })
})
