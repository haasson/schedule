const { textContainsAny } = require("../../utils/strings")

const isCalledBack = (text) => textContainsAny(text, ["вернись", "не молчи", "ответь", "просып", "просни", "вставай", "возвращ"])
const isShutUp = (text) => textContainsAny(text, ["заебал", "заткни", "замолчи", "нахуй", "отъебис", "отьебис"])
const isGreeting = (text) => textContainsAny(text, ['привет', 'здраст', 'даров', 'здравст'])
const isWeatherMentioned = (text) => textContainsAny(text, ["с погод", "по погод", "погода", "погоды"])
const isForecastMentioned = (text) => textContainsAny(text, ["прогноз", "ближайш"])
const isNowMentioned = (text) => textContainsAny(text, ["сёдня", "сегодня", "а щас", "а сейчас"])
const isQuestion = (text) => textContainsAny(text, ["че", "чё", "что", "шо", "как", "бот"])

module.exports = {
  isCalledBack,
  isShutUp,
  isGreeting,
  isWeatherMentioned,
  isForecastMentioned,
  isNowMentioned,
  isQuestion,
}