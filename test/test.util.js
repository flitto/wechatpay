const should = require('should')
const util = require('../lib/util')

describe('util test cases', function () {

  it('generateNonceSting() with no parameter', () => {
    const nonceStr = util.generateNonceString()
    nonceStr.should.be.a.String()
    nonceStr.length.should.be.equal(32)
  })

  it('generateNonceSting(16)', () => {
    const nonceStr = util.generateNonceString(16)
    nonceStr.should.be.a.String()
    nonceStr.length.should.be.equal(16)
  })

  it('getXML()', () => {
    const json = { return_code: 'SUCCESS', return_msg: 'OK' }

    const xml = util.getXML(json)
    xml.should.be.a.String()
  })

  it('parserXML()', async () => {
    const xml = '<xml>\
        <return_code><![CDATA[SUCCESS]]></return_code>\
        <return_msg><![CDATA[OK]]></return_msg>\
      </xml>'

    const data = await util.parseXML(xml)
    data.should.be.an.Object()
    data.should.have.properties(['return_code', 'return_msg'])
  })

  it('getQRSvg()', () => {
    const qr_svg = util.getQRSvg('https://www.flitto.com')
    qr_svg.should.be.a.String()
  })

})
