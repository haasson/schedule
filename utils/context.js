let msgNumber = 0
const context = {}

const updateContext = () => {
  msgNumber++
  Object.keys(context).forEach(key => {
    if (msgNumber - context[key] > 10) {
      console.log('delete', key)
      delete context[key]
    }
  })
}

const saveContext = (name) => {
  context[name] = msgNumber
}

module.exports = {
  saveContext,
  updateContext,
  context,
}

