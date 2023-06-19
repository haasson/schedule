const TelegramApi = require('node-telegram-bot-api')
const { sheduleOptions, againOptions } = require('./options')
// const UserModel = require('./models');

const token = '1872826033:AAG7apyYhkqfZ8iJeZzwJeafLiRs5DoAX1I'
// const token = '1894060164:AAFOvA_YFVNBK6_XOmLcDMMRvt4JA6Zb4Po'

const bot = new TelegramApi(token, { polling: true })

let startDate = new Date('06-17-2021');
const shedule = [
  "первая дневная смена",
  "вторая дневная смена",
  "первая ночная смена",
  "вторая ночная смена",
  "первый выходной",
  "второй выходной",
  "третий выходной",
  "четвертый выходной"
]

const days = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]

const dayInMs = 1000 * 3600 * 24


const getShedule = async (chatId) => {
  await bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions);
}

const getTodayIndex = () => {
  date = new Date();
  daysLag = Math.ceil(Math.abs(date.getTime() - startDate.getTime()) / dayInMs) - 1;
  return daysLag % 8
}

const calcShedule = async (chatId, type) => {
  switch (type) {
    case "seriozha_today": {
      const todayIndex = getTodayIndex()
      await bot.sendMessage(chatId, `Сегодня ${shedule[todayIndex]}`);
      break;
    }

    case "seriozha_weekend": {
      let todayDay = new Date().getDay();
      let shift = 6 - todayDay; // 6 - number of Saturday
      let daysLag = Math.ceil(Math.abs(new Date().getTime() + (dayInMs * shift) - startDate.getTime()) / dayInMs) - 1;
      await bot.sendMessage(chatId, `В субботу - ${shedule[daysLag % 8]}, в воскресенье - ${shedule[(daysLag + 1) % 8]}`);
      break;
    }

    case "seriozha_nearest": {
      const todayIndex = getTodayIndex()
      let todayDay = new Date().getDay()

      if (todayIndex < 4) {
        // today is working day, calculate nearest vacation
        const shift = 4 - todayIndex // days to vacation
        const nearestVacationDay = (todayDay + shift) % 7
        await bot.sendMessage(chatId, `Ближайший выходной - ${days[nearestVacationDay]}`);
      } else {
        await bot.sendMessage(chatId, `Сегодня ${shedule[todayIndex]}`);
      }
      break;
    }

    default:
      break;
  }

  // date = new Date();
  // daysLag = Math.ceil(Math.abs(date.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) - 1;
  // if (shedule[daysLag % 8] > 3) {
  //   await bot.sendMessage(chatId, `Сегодня ${shedule[daysLag % 8]}`);
  // } else {
  //   await bot.sendMessage(chatId, `Скоро ${shedule[daysLag % 8]}`);
  // }
}
// await bot.sendMessage(chatId, `Узнай как сегодня работает Серёжа`, sheduleOptions);
const start = async () => {

  bot.setMyCommands([
    { command: '/seriozha', description: 'График Сережи' },
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === '/start') {
        return bot.sendMessage(chatId, 'Привет! Я умею рассказывать как работает Сережа! (spoiler: хуёво)');
      }
      if (text === '/seriozha') {
        return getShedule(chatId)
      }
      if (text.toLowerCase().indexOf("коммунизм") !== 0) {
        return bot.sendMessage(chatId, `Коммунизм - говно!`);
      }
      if (text.toLowerCase().indexOf("вива ля раза") !== 0) {
        return bot.sendMessage(chatId, `Астала муэртэ`);
      }
      return bot.sendMessage(chatId, '{Хуйню каку-то написал}!');
    } catch (e) {
      return bot.sendMessage(chatId, 'Произошла какая то ошибочка!!!)');
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
