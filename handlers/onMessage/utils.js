const { botConfig } = require("../../config")
const { getTomorrowWeather, getWeatherForecast, getCurrentWeather } = require("../../services/weather")
const { saveContext, context } = require("../../utils/context")
const { getRandomArrayElement } = require("../../utils/math")
const { textContains } = require("../../utils/strings")
const { isNowMentioned, isWeatherMentioned, isQuestion, isForecastMentioned } = require("./conditions")

const simplePhrases = [
  { text: 'коммунизм', answer: 'Коммунизм - говно!' },
  { text: 'вива ля раза', answer: 'Астала муэртэ!' },
  { text: 'небул', answer: 'Рамиз хуйню не забьет!' },
  { text: 'чистилищ', answer: 'Не рекомендую к посещению данное место!' },
  { text: ' горный', answer: () => `${getRandomArrayElement(names)} ${getRandomArrayElement(secondNames)} уже ждёт!` },
]

let silenceTimer
const disableSilentMode = ({ chat }) => {
  const message = botConfig[chat.id].isBotSpeaks ? 'А я уже давно тут' : 'Я снова с вами :)'
  botConfig[chat.id].isBotSpeaks = true
  silenceTimer && clearTimeout(silenceTimer)
  return message
}

const enableSilentMode = () => {
  saveContext('silent')
  return 'На сколько минут заткнуться?'
}

const setSilencePeriod = ({ text, chat }) => {
  const minutes = text.match(/\d+/g)?.[0]

  if (minutes) {
    setTimeout(() => botConfig[chat.id].isBotSpeaks = false, 300)
    delete context.silent
    silenceTimer = setTimeout(() => botConfig[chat.id].isBotSpeaks = true, minutes * 60 * 1000)
    return `Заткнулся на ${minutes} минут`
  }
}

const enableHuificator = () => {
  setTimeout(() => botConfig.mode = 'huificator', 300)
  return `Хуификатор включен`
}

const disableHuificator = () => {
  botConfig.mode = ''
  return `Хуификатор выключен`
}



const getWeather = async ({ text }) => {
  if (textContains(text, "завтра")) {
    const { forecast } = await getTomorrowWeather()
    const { type, min, max } = forecast[0]
    saveContext("weather")
    return `Завтра ${type}, температура от ${min} до ${max}`
  }

  if (isForecastMentioned(text)) {
    const strings = ["Сегодня", "завтра", "послезавтра"]
    const { forecast } = await getWeatherForecast(3)
    const message = forecast.reduce((memo, day, index) => {
      const { type, min, max } = day
      return memo += `${strings[index]} ${type}, температура от ${min} до ${max}; `
    }, '')
    saveContext("weather")
    return message.slice(0, -2)
  }

  if (context.weather && isNowMentioned(text) || isWeatherMentioned(text) && isQuestion(text)) {
    const { current } = await getCurrentWeather()
    const { type, temp, feelslike } = current
    saveContext("weather")
    return `Сейчас ${type}, температура ${temp}, по ощущениям ${feelslike}`
  }
}

module.exports = {
  simplePhrases,
  disableSilentMode,
  enableSilentMode,
  setSilencePeriod,
  disableHuificator,
  enableHuificator,
  getWeather,
}