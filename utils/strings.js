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

module.exports = {
  textContains,
  textContainsAny,
  textContainsEvery,
}
