const { botConfig } = require("../../config")
const { getCurrentRates } = require("../../services/currency")
const { getTomorrowWeather, getWeatherForecast, getCurrentWeather } = require("../../services/weather")
const { saveContext, context } = require("../../utils/context")
const { getRandomArrayElement } = require("../../utils/math")
const { textContains } = require("../../utils/strings")
const { isNowMentioned, isWeatherMentioned, isQuestion, isForecastMentioned } = require("./conditions")
const { putToDatabase, getFromDatabase, deleteFromDatabase } = require('../../services/database')
const { names, secondNames } = require('../../data/eleonoraNames')

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

const getRates = async () => {
  const rates = await getCurrentRates()
  return `Курсы валют:\n🇺🇸 ${rates.usd}\n🇪🇺 ${rates.eur}\n🇰🇿 ${rates.kzt}`
}

const enableSaveMixMode = () => {
  saveContext('saveMix')
  return 'Напиши какой микс нужно сохранить'
}

const saveMix = async ({ text, from, date }) => {
  const key = `mixes/${date}`
  const payload = {
    description: text,
    user: from.first_name,
    date,
  }
  await putToDatabase({ [key]: payload })
  putToDatabase({ [`archive/${key}`]: payload })

  delete context.saveMix
  return 'Микс добавлен в базу'
}

const enableDeleteMixMode = async (msg) => {
  const numbers = msg.text.match(/\d+/g)
  if (numbers?.length) {
    const text = numbers.join(' ')
    return await deleteMix({ ...msg, text })
  }

  saveContext('deleteMix')
  return 'Напиши номера миксов, которые нужно удалить. В следующий раз можно просто писать "Удали микс Номера миксов" и я сразу удалю их из базы'
}

const deleteMix = async ({ text }) => {
  const indexes = text.split(' ').filter(el => typeof +el === 'number')

  delete context.deleteMix
  if (!indexes) {
    return 'Если честно, нихера не понятно'
  }

  const mixes = await getFromDatabase('mixes')
  if (!mixes) {
    return 'У тебя еще нет миксов, придурок!'
  }
  const promises = indexes.map(index => {
    return new Promise(async (resolve) => {
      const mixToRemove = Object.keys(mixes)[+index - 1]
      if (mixToRemove) {
        await deleteFromDatabase(`mixes/${mixToRemove}`)
        resolve(index)
      }
      resolve(null)
    })
  })

  try {
    let res = await Promise.all(promises)
    res = res.filter(el => !!el)
    if (!res.length) {
      return 'Нет таких миксов!'
    }

    if (res.length < indexes.length) {
      const removedIndexes = res.reduce((memo, value) => memo += `${value}, `, '')
      return `Удалил только ${res.length === 1 ? 'микс' : 'миксы'} номер ${removedIndexes.slice(0, -2)}. Остальные не нашел, сорян`
    }

    return res.length > 1 ? 'Туда им и дорога' : 'Это был невкусный микс, но теперь он тебя не побеспокоит'
  } catch (error) {
    console.error('error', error)
    return 'Ничего не получилось( Спроси Жеку чё за хуйня'
  }
}

const showAllMixes = async () => {
  const mixes = await getFromDatabase('mixes')
  if (!mixes) {
    return 'Миксов нет, но вы держитесь'
  }
  const text = Object.values(mixes).reduce((memo, mix, index) => {
    return memo += `${index + 1}. ${mix.description}. Добавил ${mix.user}\n`
  }, '')

  return text
}

const showRandomMix = async () => {
  const mixes = await getFromDatabase('mixes')
  if (!mixes) {
    return 'Миксов нет, но вы держитесь'
  }
  const mix = getRandomArrayElement(Object.values(mixes))

  return `${mix.description}. Добавил ${mix.user}`
}

module.exports = {
  simplePhrases,
  disableSilentMode,
  enableSilentMode,
  setSilencePeriod,
  disableHuificator,
  enableHuificator,
  getWeather,
  getRates,
  enableSaveMixMode,
  saveMix,
  enableDeleteMixMode,
  deleteMix,
  showAllMixes,
  showRandomMix,
}