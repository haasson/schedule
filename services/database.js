const {
  child, equalTo,
  getDatabase, limitToFirst,
  limitToLast,
  onValue, orderByChild,
  query,
  ref,
  remove,
  set,
  update
} = require('firebase/database')
const app = require('../plugins/firebase')


const database = getDatabase(app);

const setToDatabase = async (url, data) => {
  return await set(ref(database, url), data)
}
const getFromDatabase = async (url) => {
  const records = await query(ref(database, url))
  // const records = await query(databaseRef(database, url), orderByChild('title'))
  let res = null

  const promise = new Promise((resolve, reject) => {
    onValue(records, snapshot => {
      res = snapshot.val()
      resolve()
    })
  })

  await promise
  return res
}

const putToDatabase = async (data) => {
  return await update(ref(database), data)
}

const deleteFromDatabase = async (url) => {
  return await remove(child(ref(database), url))
}

module.exports = {
  setToDatabase,
  getFromDatabase,
  putToDatabase,
  deleteFromDatabase,
}