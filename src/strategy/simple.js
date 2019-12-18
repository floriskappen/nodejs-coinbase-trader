const Strategy = require('./strategy')

class SimpleStrategy extends Strategy {
    async run({ sticks, time }) {
        const len = sticks.length
        if (len < 20) {
            return
        }

        const last = sticks[len - 1].close
        const penultimate = sticks[len - 2].close
        const price = last

        const open = this.openPositions()

        if (open.length === 0) {
            if (last < penultimate) {
                this.onBuySignal({ price, time })
            }
        } else {
            if (last > penultimate) {
                open.forEach(p => {
                    if (p.enter.price * 1.01 < price) {
                        this.onSellSignal({
                            price,
                            size: p.enter.size,
                            position: p,
                            time
                        })
                    }
                })
            }
        }
    }
}

module.exports = SimpleStrategy
