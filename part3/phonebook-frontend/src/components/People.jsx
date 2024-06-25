const People = ({ people, onDelete }) => {
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default People;
