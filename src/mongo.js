const mongoose = require('mongoose')
require('dotenv').config()

const printCommandSyntax = () => {
  const msg = `command syntax: node mongo.js [<name> <number>]

  Specify:
    DB_TYPE     - mongodb
    DB_NAME     - name of the db
    DB_DOMAIN   - the domain where the db is hosted
    DB_PORT     - the port to connect to
    DB_USERNAME - the db username
    DB_PASSWORD - the db password
  in the .env-file.`
  console.log(msg)
}

const preparePersonModel = () => new mongoose.model(
  'Person',
  new mongoose.Schema({
    name: String,
    number: String,
  }),
)

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

const listAll = (Model) => {
  Model.find({}).then((result) => {
    result.forEach(elem => console.log(`${elem.name}:\t${elem.number}`))
    mongoose.connection.close()
  })
}

const addPerson = (Model, name, number) => {
  const person = new Model({
    name,
    number,
  })
  person.save().then((_) => {
    console.log('person added!')
    mongoose.connection.close()
  })
}

const main = () => {
  const username = process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  const [name, number] = process.argv.slice(2)

  if (username === undefined || password === undefined) {
    printCommandSyntax()
    process.exit(1)
  } else if (name !== undefined && number === undefined) {
    console.log('Please specify a number.')
    printCommandSyntax()
    process.exit(1)
  }

  const operationList = name === undefined

  const Person = preparePersonModel()
  connectToDB(username, password)

  if (operationList) {
    listAll(Person)
  } else {
    addPerson(Person, name, number)
  }
}

main()
