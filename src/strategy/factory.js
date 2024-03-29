const Simple = require('./simple')
const MACD = require('./simpleMACD')

exports.create = function(type, data) {
    console.log(type)
    switch (type) {
        case 'macd':
            return new MACD(data)
        case 'simple':
            return new Simple(data)
        default:
            return new MACD(data)
    }
}
