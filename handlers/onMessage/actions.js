const { bot, botConfig } = require("../../config");
const { context } = require('../../utils/context')
const { isBotMentioned, textContains, huificate } = require("../../utils/strings");
const { getRandomArrayElement } = require('../../utils/math')
const { greetings } = require('../../data/greetings')
const { isCalledBack, isShutUp, isGreeting, isWeatherMentioned } = require('./conditions')
const { simplePhrases, enableSilentMode, disableSilentMode, setSilencePeriod, enableHuificator, disableHuificator, getWeather } = require('./utils');
const { checkIfBotSpeaks } = require("../../utils/bot");



/********************** ACTIONS **********************/
const actions = [
  {
    name: 'disableSilentMode',
    condition: (text) => isBotMentioned(text) && isCalledBack(text),
    action: disableSilentMode,
  },
  {
    name: 'enableSilentMode',
    condition: (text) => isBotMentioned(text) && isShutUp(text),
    action: enableSilentMode,
  },
  {
    name: 'setSilencePeriod',
    condition: () => context.silent,
    action: setSilencePeriod,
  },
  {
    name: 'enableHuificator',
    condition: (text) => isBotMentioned(text) && textContains(text, "включи хуификатор"),
    action: enableHuificator,
  },

  {
    name: 'disableHuificator',
    condition: (text) => isBotMentioned(text) && textContains(text, "выключи хуификатор"),
    action: disableHuificator,
  },
  {
    name: 'huificator',
    condition: () => botConfig.mode === 'huificator',
    action: ({ text }) => huificate(text)
  },

  {
    name: 'simpleAnswer',
    condition: (text) => simplePhrases.find(phrase => textContains(text, phrase.text)),
    action: (_, { answer }) => typeof answer === 'function' ? answer() : answer
  },
  {
    name: 'greeting',
    condition: (text) => isBotMentioned(text) && isGreeting(text),
    action: ({ from }) => `Привет, ${from.first_name}! ${getRandomArrayElement(greetings)}`
  },
  {
    name: 'weather',
    condition: (text) => context.weather || isWeatherMentioned(text),
    action: getWeather,
  },
]


const handleMessage = async (msg) => {
  const { chat, text } = msg
  const selectedAction = Object.values(actions).find(action => {
    const conditionResult = action.condition(text)
    if (conditionResult) {
      return { ...action, conditionResult }
    }
  })

  if (selectedAction) {
    const answer = await selectedAction.action?.(msg, selectedAction.conditionResult)
    console.log('speak', checkIfBotSpeaks(chat.id))
    if (answer && checkIfBotSpeaks(chat.id)) {
      bot.sendMessage(chat.id, answer)
    }
  }

}

module.exports = handleMessage