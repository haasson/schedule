const { calcShedule } = require("./actions");

const onQuery = async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data.indexOf("seriozha") !== -1) {
    return calcShedule(chatId, data)
  }
}

module.exports = {
  onQuery,
}