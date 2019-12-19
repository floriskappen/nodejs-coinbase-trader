const Runner = require('../runner')
const Ticker = require('../models/ticker')

class Trader extends Runner {
    constructor(data) {
        super(data)
        this.ticker = new Ticker({
            product: this.product,
            onTick: async tick => {
                await this.onTick(tick)
            },
            onError: error => {
                this.onError(error)
            }
        })
    }

    async start() {
        this.currentCandle = null
        this.history = await this.historical.getData()
        this.ticker.start()
    }

    async onBuySignal({ price, time }) {
        const id = randomstring.generate(20)
        this.strategy.positionOpened({
            price,
            time,
            size: 1.0,
            id
        })
    }

    async onSellSignal({ price, size, time, position }) {
        // console.log(position.id)
        this.strategy.positionClosed({
            price,
            time,
            size,
            id: position.id
        })
    }

    async onTick(tick) {
        const time = Date.parse(tick.time)
        const price = parseFloat(tick.price)
        const volume = parseFloat(tick.volume)

        console.log(`Time: ${time}      Price: ${price}`)

        try {
            if (this.currentCandle) {
                this.currentCandle.onPrice({
                    price,
                    volume,
                    time
                })
            } else {
                this.currentCandle = new Candlestick({
                    interval: this.interval,
                    startTime: time,
                    volume,
                    price
                    // low,
                    // high,
                    // close,
                    // open,
                    // interval,
                    // startTime = new Date(),
                    // volume
                    // price
                })
            }

            const sticks = this.history.slice()
            sticks.push(this.currentCandle)

            await this.strategy.run({
                sticks: sticks,
                time: time
            })

            if (this.currentCandle.state === 'closed') {
                const candle = this.currentCandle
                this.currentCandle = null
                this.history.push(candle)
            }
        } catch (error) {
            console.log(error)
        }
    }

    onError(error) {}
}

module.exports = Trader
