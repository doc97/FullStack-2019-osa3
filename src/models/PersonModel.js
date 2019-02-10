const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const preparePersonModel = () => {
  const schema = new mongoose.Schema({
    name: String,
    number: String
  })
  schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString(),
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  return new mongoose.model('Person', schema)
}

const connectToDB = (username, password) => {
  const dbtype = process.env.DB_TYPE
  const dbname = process.env.DB_NAME
  const domain = process.env.DB_DOMAIN
  const port = process.env.DB_PORT
  const url = `${dbtype}://${username}:${password}@${domain}:${port}/${dbname}`

  console.log('connecting to MongoDB...')
  mongoose
    .connect(url, { useNewUrlParser: true })
    .then(result => console.log('connected to MongoDB.'))
    .catch(err => console.log(`${err.name}: ${err.errmsg}`))
}

connectToDB(process.env.DB_USERNAME, process.env.DB_PASSWORD)
module.exports = preparePersonModel()