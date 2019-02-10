require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PersonModel = require('./models/PersonModel')

/* Morgan configuration */
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

/* Middleware */
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(
  [
    ':method',
    ':url',
    ':status',
    ':res[content-length]',
    '-',
    ':response-time ms',
    ':body'
  ].join(' ')
))

/* Routes */
app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/info', (req, res) => {
  PersonModel.find({}).then(persons => {
    const html = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>`
    res.send(html)
  })
})

app.get('/api/persons', (req, res) => {
  PersonModel.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  PersonModel
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  let errors = [] 
  if (body.name === undefined) errors.push('name-kenttä puuttuu')
  if (body.number === undefined) errors.push('number-kenttä puuttuu')
  if (errors.length > 0)
    return res.status(400).json({ errors: errors })

  PersonModel
    .findOne({ name: body.name })
    .then(result => {
      if (result !== null) {
        console.log(result)
        const error = { errorMsg: 'samanniminen henkilö on jo puhelinluettelossa!' }
        return res.status(400).json(error)
      } else {
        const newPerson = new PersonModel({
          name: body.name,
          number: body.number
        })

        newPerson.save().then(savedPerson => {
          res.json(savedPerson.toJSON())
        })
      }
    })
})

app.delete('/api/persons/:id', (req, res) => {
  PersonModel
    .findByIdAndRemove(req.params.id)
    .then(_ => res.status(204).end())
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  PersonModel
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(err => next(err))
})

/* Error handling middleware */
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  console.log(err)

  if (err.name === 'CastError' && err.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' })
  }

  next(err)
}

app.use(unknownEndpoint)
app.use(errorHandler)

/* Server start */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))