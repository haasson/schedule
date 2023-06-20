module.exports = {
  getRandomNumber: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  getRandomArrayElement: (array) => {
    const index = getRandomNumber(0, array.length)
    console.log(index, array[index])
    return array[index]
  }
}