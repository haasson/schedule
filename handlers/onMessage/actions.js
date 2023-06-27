const { bot, botConfig } = require("../../config");
const { context } = require('../../utils/context')
const { isBotMentioned, textContains, huificate } = require("../../utils/strings");
const { getRandomArrayElement } = require('../../utils/math')
const { greetings } = require('../../data/greetings')
const { isCalledBack, isShutUp, isGreeting, isWeatherMentioned, isRatesMentioned, isHookahMixToSave, isRandomHookahMixToShow, isAllHookahMixesToShow, isHookahMixToDelete, isThrowDice } = require('./conditions')
const { simplePhrases, enableSilentMode, disableSilentMode, setSilencePeriod, enableHuificator, disableHuificator, getWeather, getRates, enableSaveMixMode, saveMix, enableDeleteMixMode, deleteMix, showAllMixes, showRandomMix } = require('./utils');
const { checkIfBotSpeaks } = require("../../utils/bot");



/********************** ACTIONS **********************/
const actions = [
  {
    name: 'disableSilentMode',
    condition: (text) => isBotMentioned(text) && isCalledBack(text),
    message: disableSilentMode,
  },
  {
    name: 'enableSilentMode',
    condition: (text) => isBotMentioned(text) && isShutUp(text),
    message: enableSilentMode,
  },
  {
    name: 'setSilencePeriod',
    condition: () => context.silent,
    message: setSilencePeriod,
  },
  {
    name: 'enableHuificator',
    condition: (text) => isBotMentioned(text) && textContains(text, "включи хуификатор"),
    message: enableHuificator,
  },

  {
    name: 'disableHuificator',
    condition: (text) => isBotMentioned(text) && textContains(text, "выключи хуификатор"),
    message: disableHuificator,
  },
  {
    name: 'huificator',
    condition: () => botConfig.mode === 'huificator',
    message: ({ text }) => huificate(text)
  },

  {
    name: 'simpleAnswer',
    condition: (text) => simplePhrases.find(phrase => textContains(text, phrase.text)),
    message: (_, { answer } = {}) => typeof answer === 'function' ? answer() : answer,
  },
  {
    name: 'greeting',
    condition: (text) => isBotMentioned(text) && isGreeting(text),
    message: ({ from }) => `Привет, ${from.first_name}! ${getRandomArrayElement(greetings)}`
  },
  {
    name: 'weather',
    condition: (text) => context.weather || isWeatherMentioned(text),
    message: getWeather,
  },
  {
    name: 'currency',
    condition: isRatesMentioned,
    message: getRates,
  },
  {
    name: 'enableSaveMixMode',
    condition: isHookahMixToSave,
    message: enableSaveMixMode,
  },
  {
    name: 'saveMix',
    condition: () => context.saveMix,
    message: saveMix,
  },
  {
    name: 'enableDeleteMixMode',
    condition: isHookahMixToDelete,
    message: enableDeleteMixMode,
  },
  {
    name: 'deleteMix',
    condition: () => context.deleteMix,
    message: deleteMix,
  },
  {
    name: 'showAllMixes',
    condition: isAllHookahMixesToShow,
    message: showAllMixes,
  },
  {
    name: 'showRandomMix',
    condition: isRandomHookahMixToShow,
    message: showRandomMix,
  },
  {
    name: 'dice',
    condition: isThrowDice,
    action: { name: 'sendDice' }
  }
]


const handleMessage = async (msg) => {
  const { chat, text } = msg
  let selectedAction

  Object.values(actions).forEach(action => {
    const conditionResult = action.condition(text)
    if (conditionResult) {
      selectedAction = { ...action, conditionResult }
    }
  })

  if (selectedAction) {
    const answer = await selectedAction.message?.(msg, selectedAction.conditionResult)

    if (answer && checkIfBotSpeaks(chat.id)) {
      return bot.sendMessage(chat.id, answer)
    }
    if (selectedAction.action) {
      bot[selectedAction.action.name](chat.id)
    }
  }

}

module.exports = handleMessage