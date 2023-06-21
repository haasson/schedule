const TelegramApi = require('node-telegram-bot-api')
const { sheduleOptions } = require('./options')
const { scheduleStartDate, sheduleStrings, daysOfWeek, dayInMs } = require('./data/schedule')
const { names, secondNames } = require('./data/eleonoraNames')
const { getRandomArrayElement } = require('./utils/math')
const { textContains, textContainsAny, textContainsEvery } = require('./utils/strings')

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

const sendMessage = (message) => {
  bot.sendMessage(chatId, message)
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
      if (textContains("небул")) {
        return sendMessage(`Рамиз хуйню не забьет!`);
      }
      if (textContains("чистилищ")) {
        return sendMessage(`Не рекомендую к посещению данное место!`);
      }
      if (textContains("бот") && textContainsAny(['привет', 'здраст', 'даров', 'здравст'])) {
        return sendMessage(`Привет, ${msg.from.first_name}!`);
      }
      if (textContains(" горный")) {
        return sendMessage(`${getRandomArrayElement(names)} ${getRandomArrayElement(secondNames)} уже ждёт!`);
      }
      if (textContainsAny(["с погодой", "по погоде", "погода"]) && textContainsAny["че", "чё", "что", "шо", "какая"]) {
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=57ae806dbe4a461081792647232006&q=Barnaul&aqi=no`)
        console.log(res)
        const data = await res.json()
        console.log(data)
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
