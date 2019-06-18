import Bot from './Core/Bot'

const config = require('../config.json')
const bot = new Bot(config)

process.on('beforeExit', bot.quit)