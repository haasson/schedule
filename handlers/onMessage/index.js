const { updateContext } = require('../../utils/context')
const { bot, botConfig } = require('../../config')
const { sheduleOptions } = require('../../config/options')
const handleMessage = require('./actions')
const { textContainsAny } = require('../../utils/strings')


const setInitialConfig = (chatId) => {
  const config = botConfig[chatId]
  if (!config) {
    botConfig[chatId] = {
      isBotSpeaks: true,
    }
  }
}

const shouldSkipMessage = (msg) => {
  return msg.from.is_bot || !msg.text
}


const onMessage = async (msg) => {

  if (shouldSkipMessage(msg)) return

  const chatId = msg.chat.id;
  setInitialConfig(chatId)
  updateContext()


  try {
    if (msg.text.split('@')[0] === '/seriozha' || textContainsAny(msg.text, ["график", "работает"]) && textContainsAny(msg.text, ["сереж", "серёж"])) {
      return await bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions);
    }
    // if (checkSchedule()) {
    //   return bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions)
    // }

    handleMessage(msg)
  } catch (e) {
    console.log(e)
    return bot.sendMessage(chatId, 'Опа, какая-то ошибочка! Не ругайте программиста, он ваяет как умеет 🥺');
  }
}


module.exports = {
  onMessage
}