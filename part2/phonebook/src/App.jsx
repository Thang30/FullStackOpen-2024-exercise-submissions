import { useState } from 'react';
import Filter from './components/Filter';
import People from './components/People';
import PersonForm from './components/PersonForm';

const App = () => {
  const [people, setPeople] = useState([ 
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [filter, setFilter] = useState('');

  const addPerson = (newPerson) => {
    setPeople(people.concat(newPerson));
    setFilter(''); 
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const peopleToShow = people.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new person</h3>
      <PersonForm onSubmit={addPerson} />
      <h3>Numbers</h3>
      <People people={peopleToShow} />
    </div>
  );
};

export default App;
