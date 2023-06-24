const TelegramApi = require('node-telegram-bot-api')

const token = '1872826033:AAG7apyYhkqfZ8iJeZzwJeafLiRs5DoAX1I'
const bot = new TelegramApi(token, { polling: true })
const botConfig = {}

module.exports = {
  bot,
  botConfig,
}