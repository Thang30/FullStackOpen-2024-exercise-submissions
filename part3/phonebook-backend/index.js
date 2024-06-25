const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

morgan.token('body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body); 
  }
  return ' - ';
});

app.use(morgan(':method :url :status :response-time ms [:body]'));

// Get all persons
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => next(error));
});

// Get a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// Add a new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing name or number' });
  }

  const newPerson = new Person({ name, number });

  newPerson.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error));
});

// Delete a person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'Malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
