const CoinbasePro = require('coinbase-pro')
const config = require('../../../configuration')

class Ticker {
    constructor({ product, onTick, onError }) {
        this.client = new CoinbasePro.PublicClient()
        this.product = product
        this.onTick = onTick
        this.onError = onError
        this.running = false
    }

    start() {
        this.client = new CoinbasePro.WebsocketClient(
            [this.product],
            config.get('COINBASE_WS_URL'),
            null,
            { channels: ['ticker', 'heartbeat'] }
        )

        this.client.on('message', async data => {
            if (data.type === 'ticker') {
                await this.onTick(data)
            }
        })

        this.client.on('error', err => {
            this.onError(err)
            this.client.connect()
        })

        this.client.on('close', () => {
            if (this.running) {
                this.client.connect()
            }
        })
    }

    stop() {
        this.running = false
        this.client.close()
    }
}

module.exports = Ticker
