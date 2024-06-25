const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

morgan.token('body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body);
  }
  return ' - ';
});

app.use(morgan(':method :url :status :response-time ms [:body]'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).send('Person not found');
    }
  }).catch(err => res.status(400).send('Invalid ID'));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).send('Person not found');
    }
  }).catch(err => res.status(400).send('Invalid ID'));
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing name or number' });
  }

  const newPerson = new Person({ name, number });

  newPerson.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to save person' });
    });
});


app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing name or number' });
  }

  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send('Person not found');
      }
    }).catch(err => res.status(400).send('Invalid ID'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
