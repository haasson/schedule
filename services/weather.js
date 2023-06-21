const getUrl = ({ type = 'current', params } = {}) => {
  const apiToken = '57ae806dbe4a461081792647232006'
  let query = ''
  if (params) {
    Object.entries(params).forEach(param => {
      query += `&${param[0]}=${param[1]}`
    })
  }

  return `http://api.weatherapi.com/v1/${type}.json?key=${apiToken}&q=Barnaul&aqi=no&lang=ru${query}`
}

const buildDataObject = (response) => {
  const { location, current, forecast } = response
  const currentWeather = {
    type: current.condition.text.toLowerCase(),
    temp: `${current.temp_c}°`,
    feelslike: `${current.feelslike_c}°`
  }
  let forecastWeather

  if (forecast) {
    forecastWeather = forecast.forecastday.map(dayForecast => {
      const { mintemp_c, maxtemp_c, condition } = dayForecast.day
      return {
        type: condition.text.toLowerCase(),
        min: `${mintemp_c}°`,
        max: `${maxtemp_c}°`
      }
    })
  }
  return {
    city: location.name,
    current: currentWeather,
    forecast: forecastWeather
  }
}

const makeRequest = async (params) => {
  const url = getUrl(params)
  const res = await fetch(url)
  const data = await res.json()
  return buildDataObject(data)
}

const getCurrentWeather = async () => {
  const data = await makeRequest()
  return data
}

const getTomorrowWeather = async () => {
  const data = await makeRequest({ type: 'forecast', params: { days: 2 } })
  data.forecast = data.forecast.slice(1)
  return data
}


const getWeatherForecast = async (days) => {
  const data = await makeRequest({ type: 'forecast', params: { days } })
  return data
}

module.exports = {
  getCurrentWeather,
  getTomorrowWeather,
  getWeatherForecast,
}