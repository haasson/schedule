const TelegramApi = require('node-telegram-bot-api')
const { sheduleOptions } = require('./options')
const { scheduleStartDate, sheduleStrings, daysOfWeek, dayInMs } = require('./data/schedule')
const { names, secondNames } = require('./data/eleonoraNames')
const { getRandomArrayElement } = require('./utils/math')

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

    if (msg.from.is_bot) return

    console.log(msg)

    try {
      if (text === '/start') {
        return bot.sendMessage(chatId, 'Привет! Я умею рассказывать как работает Сережа! (spoiler: хуёво)');
      }
      if (text === '/seriozha') {
        return getShedule(chatId)
      }
      if (text.toLowerCase().indexOf("коммунизм") !== -1) {
        return bot.sendMessage(chatId, `Коммунизм - говно!`);
      }
      if (text.toLowerCase().indexOf("вива ля раза") !== -1) {
        return bot.sendMessage(chatId, `Астала муэртэ!`);
      }
      if (text.toLowerCase().indexOf("небул") !== -1) {
        return bot.sendMessage(chatId, `Рамиз хуйню не забьет!`);
      }
      if (text.toLowerCase().indexOf("чистилищ") !== -1) {
        return bot.sendMessage(chatId, `Не рекомендую к посещению данное место!`);
      }
      if (text.toLowerCase().indexOf("бот") !== -1 && (text.toLowerCase().indexOf("привет") !== -1 || text.toLowerCase().indexOf("здраст") !== -1 || text.toLowerCase().indexOf("здравст") !== -1)) {
        return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}!`);
      }
      if (text.toLowerCase().indexOf(" горный") !== -1) {
        return bot.sendMessage(chatId, `${getRandomArrayElement(names)} ${getRandomArrayElement(secondNames)} уже ждёт!`);
      }
      // return bot.sendMessage(chatId, 'Хуйню какую-то написал!');
    } catch (e) {
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
