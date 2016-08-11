var should = require('should')
  , util = require('../lib/util');

describe('util test cases', function() {

  it('generateNonceSting() with no parameter', function(done) {
    var nonceStr = util.generateNonceString();
    nonceStr.should.be.a.String();
    nonceStr.length.should.be.equal(32);
    done();
  });

  it('generateNonceSting(16)', function(done) {
    var nonceStr = util.generateNonceString(16);
    nonceStr.should.be.a.String();
    nonceStr.length.should.be.equal(16);
    done();
  });

  it('getXML()', function(done) {
    var json = {return_code: 'SUCCESS', return_msg: 'OK'};

    var xml = util.getXML(json);
    xml.should.be.a.String();
    done();
  });

  it('parserXML()', function(done) {
    var xml = '<xml>\
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
});
