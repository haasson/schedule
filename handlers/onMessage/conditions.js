const { textContainsAny, isBotMentioned } = require("../../utils/strings")

const isCalledBack = (text) => textContainsAny(text, ["вернись", "не молчи", "ответь", "просып", "просни", "вставай", "возвращ"])
const isShutUp = (text) => textContainsAny(text, ["заебал", "заткни", "замолчи", "нахуй", "отъебис", "отьебис"])
const isGreeting = (text) => textContainsAny(text, ['привет', 'здраст', 'даров', 'здравст'])
const isWeatherMentioned = (text) => textContainsAny(text, ["с погод", "по погод", "погода", "погоды"])
const isForecastMentioned = (text) => textContainsAny(text, ["прогноз", "ближайш"])
const isNowMentioned = (text) => textContainsAny(text, ["сёдня", "сегодня", "а щас", "а сейчас"])
const isQuestion = (text) => textContainsAny(text, ["че", "чё", "что", "шо", "как", "бот"])
const isRatesMentioned = (text) => textContainsAny(text, ["курс", "стои", "цен"]) && textContainsAny(text, ["доллар", "евро", "тенге", "валют"])
const isHookahMixMentioned = (text) => isBotMentioned(text) && textContainsAny(text, ["микс", "вкус", "забивк"])
const isHookahMixToSave = (text) => isHookahMixMentioned(text) && textContainsAny(text, ["сохрани", "добавь"])
const isHookahMixToDelete = (text) => isHookahMixMentioned(text) && textContainsAny(text, ["удал", "убери", "выкинь"])
const isRandomHookahMixToShow = (text) => isHookahMixMentioned(text) && textContainsAny(text, ["дай", "вкинь", "посоветуй", "нужен", "нужна", "случайн", "рандомн"])
const isAllHookahMixesToShow = (text) => isHookahMixMentioned(text) && textContainsAny(text, ["все", "список", "сохранен"])


module.exports = {
  isCalledBack,
  isShutUp,
  isGreeting,
  isWeatherMentioned,
  isForecastMentioned,
  isNowMentioned,
  isQuestion,
  isRatesMentioned,
  isHookahMixToSave,
  isHookahMixToDelete,
  isRandomHookahMixToShow,
  isAllHookahMixesToShow,
}