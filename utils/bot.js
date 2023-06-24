const { botConfig } = require("../config")

const checkIfBotSpeaks = (chatId) => {
  const chat = botConfig[chatId]
  if (!chat) return true
  return chat.isBotSpeaks
}

module.exports = {
  checkIfBotSpeaks,
}