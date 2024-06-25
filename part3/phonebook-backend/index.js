const express = require('express');
const morgan = require('morgan'); // Require morgan middleware

const app = express();
const port = 3001;

// Hardcoded phonebook data
const phonebook = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
];

// Function to simulate data persistence (replace with actual database in production)
const savePhonebook = () => {
  // Simulate saving phonebook to a file or database (replace with your implementation)
  console.log('Phonebook data saved (simulated)');
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log HTTP requests in the console (tiny preset)
app.use(morgan('tiny'));

// Route for phonebook entries (GET all)
app.get('/api/persons', (req, res) => {
  res.json(phonebook);
});

// Route for a single phonebook entry (GET)
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`Person with id ${id} not found.`);
  }
});

// Route to delete a phonebook entry (DELETE)
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personIndex = phonebook.findIndex((p) => p.id === id);

  if (personIndex !== -1) {
    phonebook.splice(personIndex, 1); // Remove entry from phonebook array
    savePhonebook(); // Simulate saving updated data
    res.status(204).send(); // 204 No Content (deletion successful)
  } else {
    res.status(404).send(`Person with id ${id} not found.`);
  }
});

// Route to add a new phonebook entry (POST) with error handling
app.post('/api/persons', (req, res) => {
  const newPerson = req.body; // Get data from request body

  // Validate required fields (name and number)
  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ error: 'Missing name or number' }); // Bad Request
  }

  // Check for duplicate name
  if (phonebook.find((p) => p.name === newPerson.name)) {
    return res.status(409).json({ error: 'name must be unique' }); // Conflict
  }

  // Generate a unique ID using Math.random with a large enough range
  let uniqueId;
  do {
    uniqueId = Math.floor(Math.random() * 1000000000).toString(); // Generate 8-digit base-36 ID
  } while (phonebook.find((p) => p.id === uniqueId)); // Check for duplicates

  // Add new entry with ID and data to phonebook
  phonebook.push({ id: uniqueId, ...newPerson });
  savePhonebook(); // Simulate saving updated data

  res.status(201).json({ ...newPerson, id: uniqueId }); // Return created entry with ID
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
