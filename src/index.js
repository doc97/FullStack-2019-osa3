const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/* Raw data */
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '045-1236543'
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '041-21423123'
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '040-4323234'
  },
  {
    id: 4,
    name: 'Martti Tienari',
    number: '09-784232'
  }
]

/* Utility functions */
const generateId = () => {
  const MAX_ID = 1000
  if (persons.length === MAX_ID)
    return -1

  let id;
  do {
    // [1, 1000]
    id = Math.ceil(Math.random() * 1000)
  } while (persons.some(p => p.id === id))
  return id
}

/* Routes */
app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/info', (req, res) => {
  const html = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
  <p>${new Date()}</p>`
  res.send(html)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const newId = generateId()

  let errors = [] 
  if (body.name === undefined) errors.push('name-kenttä puuttuu')
  if (body.number === undefined) errors.push('number-kenttä puuttuu')
  if (persons.some(p => p.name === body.name)) errors.push('samanniminen henkilö on jo puhelinluettelossa!')
  if (newId === -1) errors.push('puhelinluettelo on täynnä!')

  if (errors)
    return res.status(400).json({ errors: errors })

  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

/* Server start */
const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))