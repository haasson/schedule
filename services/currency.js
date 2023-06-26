const fetchRates = async () => {
  const apiToken = 'cbedc3bd749f4cd6b32c31d2d99b6ac3'

  const res = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiToken}`);
  const data = await res.json()
  return data
}

const getCurrentRates = async () => {
  const rates = await fetchRates() // based on USD

  const { RUB, EUR, KZT } = rates.rates
  const usd = RUB.toFixed(2)
  const eur = (usd / EUR).toFixed(2)
  const kzt = (usd / KZT).toFixed(2)

  return { usd, eur, kzt }
}

module.exports = {
  getCurrentRates
}