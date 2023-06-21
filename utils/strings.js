const textContains = function (string, substring) {
  return string.toLowerCase().indexOf(substring) !== -1
}

const textContainsAny = function (string, substrings) {
  return substrings.some(el => {
    return textContains(string, el)
  })
}

const textContainsEvery = function (string, substrings) {
  return substrings.every(el => {
    return textContains(string, el)
  })
}

const isBotMentioned = (text) => {
  console.log(text.toLowerCase().indexOf("бот"), textContainsAny(text, ["сережа", "серёжа", " бот",]))
  return textContainsAny(text, ["сережа", "серёжа", " бот",]) || text.toLowerCase().indexOf("бот") === 0.
}

const huificate = (text) => {
  const letters = ["ю", "и", "я", "э", "о", "а", "ы", "е", "ё", "у",]
  // работа - хуебота, миксер - хуиксер, клякса - хуякса, лыжи - хуижи, люстра - хуюстра, семен - хуемен, мэска - хуэска
  const textByWord = text.split(" ")
  const huificatedWords = textByWord.map(word => {
    let edge
    word = word.toLowerCase()
    word.split('').forEach((symbol, index) => {
      if (edge) return
      if (letters.includes(symbol)) {
        edge = index
      }
    })
    if (edge === undefined) return word

    const slicedWord = word.slice(edge)
    console.log(slicedWord, edge)
    if (["и", "я", "ю", "э", "ы", "ё", "е"].includes(slicedWord.charAt(0))) {
      return `ху${slicedWord}`
    }
    if (["о",].includes(slicedWord.charAt(0))) {
      return `хуё${slicedWord.slice(1)}`
    }
    if (["а",].includes(slicedWord.charAt(0))) {
      return `хуя${slicedWord.slice(1)}`
    }
    if (["у",].includes(slicedWord.charAt(0))) {
      return `хую${slicedWord.slice(1)}`
    }
    return ""
  })

  console.log(huificatedWords)
  return huificatedWords.join(' ')
}

module.exports = {
  textContains,
  textContainsAny,
  textContainsEvery,
  isBotMentioned,
  huificate,
}
