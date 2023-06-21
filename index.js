const TelegramApi = require('node-telegram-bot-api')
const { sheduleOptions } = require('./options')
const { scheduleStartDate, sheduleStrings, daysOfWeek, dayInMs } = require('./data/schedule')
const { names, secondNames } = require('./data/eleonoraNames')
const { getRandomArrayElement } = require('./utils/math')
const { textContains, textContainsAny, textContainsEvery } = require('./utils/strings')
const { getCurrentWeather, getTomorrowWeather, getWeatherForecast } = require('./services/weather')

const token = '1872826033:AAG7apyYhkqfZ8iJeZzwJeafLiRs5DoAX1I'
const bot = new TelegramApi(token, { polling: true })



const getShedule = async (chatId) => {
  await bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions);
}

const getTodayIndex = () => {
  date = new Date();
  daysLag = Math.ceil(Math.abs(date.getTime() - scheduleStartDate.getTime()) / dayInMs) - 1;
  return daysLag % 8
}

const calcShedule = async (chatId, type) => {
  switch (type) {
    case "seriozha_today": {
      const todayIndex = getTodayIndex()
      await bot.sendMessage(chatId, `Сегодня ${sheduleStrings[todayIndex]}`);
      break;
    }

    case "seriozha_weekend": {
      let todayDay = new Date().getDay();
      let shift = 6 - todayDay; // 6 - number of Saturday
      let daysLag = Math.ceil(Math.abs(new Date().getTime() + (dayInMs * shift) - scheduleStartDate.getTime()) / dayInMs) - 1;
      await bot.sendMessage(chatId, `В субботу - ${sheduleStrings[daysLag % 8]}, в воскресенье - ${sheduleStrings[(daysLag + 1) % 8]}`);
      break;
    }

    case "seriozha_nearest": {
      const todayIndex = getTodayIndex()
      let todayDay = new Date().getDay()

      if (todayIndex < 4) {
        // today is working day, calculate nearest vacation
        const shift = 4 - todayIndex // days to vacation
        const nearestVacationDay = (todayDay + shift) % 7
        await bot.sendMessage(chatId, `Ближайший выходной - ${daysOfWeek[nearestVacationDay]}`);
      } else {
        await bot.sendMessage(chatId, `Сегодня ${sheduleStrings[todayIndex]}`);
      }
      break;
    }

    default:
      break;
  }
}

// await bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions);
const start = async () => {

  bot.setMyCommands([
    { command: '/seriozha', description: 'График Сережи' },
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg)

    if (msg.from.is_bot) return

    const sendMessage = (message) => {
      bot.sendMessage(chatId, message)
    }

    try {
      if (text === '/start') {
        return sendMessage('Привет! Я умею рассказывать как работает Сережа! (spoiler: хуёво)');
      }
      if (text === '/seriozha') {
        return getShedule(chatId)
      }
      if (textContains(text, "коммунизм")) {
        return sendMessage(`Коммунизм - говно!`);
      }
      if (textContains(text, "вива ля раза")) {
        return sendMessage(`Астала муэртэ!`);
      }
      if (textContains(text, "небул")) {
        return sendMessage(`Рамиз хуйню не забьет!`);
      }
      if (textContains(text, "чистилищ")) {
        return sendMessage(`Не рекомендую к посещению данное место!`);
      }
      if (textContains(text, "бот") && textContainsAny(text, ['привет', 'здраст', 'даров', 'здравст'])) {
        return sendMessage(`Привет, ${msg.from.first_name}!`);
      }
      if (textContains(text, " горный")) {
        return sendMessage(`${getRandomArrayElement(names)} ${getRandomArrayElement(secondNames)} уже ждёт!`);
      }
      if (textContainsAny(text, ["с погод", "по погод", "погода", "погоды"])) {

        if (textContains(text, "завтра")) {
          const { forecast } = await getTomorrowWeather()
          const { type, min, max } = forecast[0]
          return sendMessage(`Завтра ${type}, температура от ${min} до ${max}`);
        }

        if (textContainsAny(text, ["прогноз", "ближайш"])) {
          const strings = ["Сегодня", "завтра", "послезавтра"]
          const { forecast } = await getWeatherForecast(3)
          const message = forecast.reduce((memo, day, index) => {
            const { type, min, max } = day
            return memo += `${strings[index]} ${type}, температура от ${min} до ${max}; `
          }, '')
          return sendMessage(message.slice(0, -2));
        }

        if (textContainsAny(text, ["че", "чё", "что", "шо", "как", "бот"])) {
          const { current } = await getCurrentWeather()
          console.log(current)
          const { type, temp, feelslike } = current
          return sendMessage(`Сегодня ${type}, температура ${temp}, по ощущениям ${feelslike}`);
        }
      }
      // return bot.sendMessage(chatId, 'Хуйню какую-то написал!');
    } catch (e) {
      console.log(e)
      // return bot.sendMessage(chatId, 'Произошла какая то ошибочка!!!)');
    }

  })

  bot.on('callback_query', async msg => {
    // console.log(msg);
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data.indexOf("seriozha") !== -1) {
      return calcShedule(chatId, data)
    }
  })
}

start()
