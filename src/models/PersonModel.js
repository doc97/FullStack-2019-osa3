const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const preparePersonModel = () => {
  const schema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true,
      unique: true,
    },
    number: {
      type: String,
      minlength: 8,
      required: true,
    },
  })
  schema.set('toJSON', {
    transform: (document, returnedObjectModified) => {
      returnedObjectModified.id = returnedObjectModified._id.toString()
      delete returnedObjectModified._id
      delete returnedObjectModified.__v
    },
  })
  schema.plugin(validator)

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
    .then(_ => console.log('connected to MongoDB.'))
    .catch(err => console.log(`${err.name}: ${err.errmsg}`))
}

connectToDB(process.env.DB_USERNAME, process.env.DB_PASSWORD)
module.exports = preparePersonModel()
