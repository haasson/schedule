const { bot } = require('./config')

const { onMessage } = require('./handlers/onMessage')
const { calcShedule } = require('./handlers/onQuery/actions')

const start = async () => {
  bot.setMyCommands([
    { command: '/seriozha', description: 'График Сережи' },
  ])

  bot.on('message', onMessage)
  bot.on('callback_query', calcShedule)
}

start()
