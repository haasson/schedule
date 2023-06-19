module.exports = {
  sheduleOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Какая смена сегодня', callback_data: 'seriozha_today' }],
        [{ text: 'Как работает в выходные', callback_data: 'seriozha_weekend' }],
        [{ text: 'Когда ближайшие выходные', callback_data: 'seriozha_nearest' }]
      ]
    })
  },

  againOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Играть еще раз', callback_data: '/again' }],
      ]
    })
  }
}
