const getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomArrayElement = function (array) {
  const index = getRandomNumber(0, array.length)
  console.log(index, array[index])
  return array[index]
}

module.exports = {
  getRandomNumber,
  getRandomArrayElement,
}