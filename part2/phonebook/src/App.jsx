import { useState, useEffect } from 'react';
import Backend from './Backend';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import People from './components/People';

const App = () => {
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      const data = await Backend.getAllPeople();
      setPeople(data);
    };

    fetchPeople();
  }, []);

  const addOrUpdatePerson = async (newPerson) => {
    const existingPerson = people.find((person) => person.name === newPerson.name);

    if (existingPerson) {
      // Update existing person
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = await Backend.updatePerson(existingPerson.id, newPerson);
        setPeople(people.map((person) => (person.id === updatedPerson.id ? updatedPerson : person)));
      }
    } else {
      // Add new person
      const addedPerson = await Backend.addPerson(newPerson);
      setPeople(people.concat(addedPerson));
      setFilter(''); // Clear filter after adding a person
    }
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
      <PersonForm onSubmit={addOrUpdatePerson} />
      <h3>Numbers</h3>
      <People people={peopleToShow} />
    </div>
  );
};

export default App;
