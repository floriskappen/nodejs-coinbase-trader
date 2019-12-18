// Requires
const program = require('commander')
const Historical = require('./src/historical')
const Backtester = require('./src/backtester')
const config = require('./configuration')

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1e3)

function toDate(val) {
    return new Date(val * 1e3)
}

program
    .version('1.0.0')
    .option(
        '-i, --interval <interval>',
        'Interval in seconds for Candlestick',
        parseInt
    )
    .option('-p, --product <product>', 'Product identifier', 'BTC-EUR')
    .option(
        '-s, --start <start>',
        'Start Time in Unix seconds',
        toDate,
        yesterday
    )
    .option('-e, --end [end]', 'End time in Unix seconds', toDate, now)
    .option('-t, --strategy <strategy>', 'Strategy Type', 'macd')
    .parse(process.argv)

// Configurations
const main = async function() {
    const { interval, product, start, end, strategy } = program
    const tester = new Backtester({
        start,
        end,
        product,
        interval,
        strategyType: strategy
    })

    await tester.start()
}

main()
