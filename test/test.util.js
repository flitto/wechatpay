const should = require('should');
const util = require('../lib/util');

describe('util test cases', function() {

  it('generateNonceSting() with no parameter', function(done) {
    const nonceStr = util.generateNonceString();
    nonceStr.should.be.a.String();
    nonceStr.length.should.be.equal(32);
    done();
  });

  it('generateNonceSting(16)', function(done) {
    const nonceStr = util.generateNonceString(16);
    nonceStr.should.be.a.String();
    nonceStr.length.should.be.equal(16);
    done();
  });

  it('getXML()', function(done) {
    const json = {return_code: 'SUCCESS', return_msg: 'OK'};

    const xml = util.getXML(json);
    xml.should.be.a.String();
    done();
  });

  it('parserXML()', function(done) {
    const xml = '<xml>\
        <return_code><![CDATA[SUCCESS]]></return_code>\
        <return_msg><![CDATA[OK]]></return_msg>\
      </xml>';

    util.parseXML(xml, function(err, data) {
      should.not.exists(err);
      data.should.be.an.Object();
      data.should.have.properties(['return_code', 'return_msg']);
      done();
    });
  });

  it('getQRSvg()', function(done) {
    const qr_svg = util.getQRSvg('https://www.flitto.com');
    qr_svg.should.be.a.String();
    done();
  });

});
