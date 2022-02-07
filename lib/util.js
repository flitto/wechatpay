const xml2js = require('xml2js')
const qr = require('qr-image')

exports.generateNonceString = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const len = chars.length
  let nonceStr = ''
  for (let i = 0; i < (length || 32); i++) {
    nonceStr += chars.charAt(Math.floor(Math.random() * len))
  }
  return nonceStr
}

exports.getXML = (json) => {
  const builder = new xml2js.Builder()
  return builder.buildObject(json)
}

exports.parseXML = (str) => {
  const parser = new xml2js.Parser({ trim: true, explicitArray: false, explicitRoot: false })
  return parser.parseStringPromise(str)
}

exports.getQRSvg = (url) => {
  return qr.imageSync(url, { type: 'svg' })
}
