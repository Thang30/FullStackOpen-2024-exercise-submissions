import { useState, useEffect } from 'react';
import Backend from './Backend';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import People from './components/People';
import Notification from './components/Notification';

const App = () => {
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: null, isError: false });

  useEffect(() => {
    Backend.getAllPeople()
      .then(initialPeople => setPeople(initialPeople))
      .catch(error => {
        console.error(error);
        setNotification({ message: 'People could not be obtained', isError: true });
        setTimeout(() => setNotification({ message: null, isError: false }), 5000);
      });
  }, []);

  const addOrUpdatePerson = (newPerson) => {
    const existingPerson = people.find(person => person.name === newPerson.name);

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newPerson.number };

        Backend.updatePerson(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPeople(people.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNotification({ message: `Updated ${returnedPerson.name}`, isError: false });
            setTimeout(() => setNotification({ message: null, isError: false }), 5000);
          })
          .catch(error => {
            console.error(error);
            setNotification({ message: `Information of ${newPerson.name} has already been removed from server`, isError: true });
            setPeople(people.filter(p => p.id !== existingPerson.id));
            setTimeout(() => setNotification({ message: null, isError: false }), 5000);
          });
      }
    } else {
      Backend.addPerson(newPerson)
        .then(returnedPerson => {
          setPeople(people.concat(returnedPerson));
          setNotification({ message: `Added ${returnedPerson.name}`, isError: false });
          setTimeout(() => setNotification({ message: null, isError: false }), 5000);
        })
        .catch(error => {
          console.error(error);
          setNotification({ message: `Could not add ${newPerson.name}`, isError: true });
          setTimeout(() => setNotification({ message: null, isError: false }), 5000);
        });
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      Backend.deletePerson(id)
        .then(() => {
          setPeople(people.filter(person => person.id !== id));
          setNotification({ message: `Deleted ${name}`, isError: false });
          setTimeout(() => setNotification({ message: null, isError: false }), 5000);
        })
        .catch(error => {
          console.error(error);
          setNotification({ message: `Information of ${name} has already been removed from server`, isError: true });
          setTimeout(() => setNotification({ message: null, isError: false }), 5000);
        });
    }
  };

  const peopleToShow = people.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} isError={notification.isError} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new person</h3>
      <PersonForm onSubmit={addOrUpdatePerson} />
      <h3>Numbers</h3>
      <People people={peopleToShow} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
