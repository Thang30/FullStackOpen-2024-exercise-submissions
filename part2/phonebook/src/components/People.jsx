const People = ({ people, onDelete }) => (
  <ul>
    {people.map((person) => (
      <li key={person.name}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id)}>delete</button>
      </li>
    ))}
  </ul>
);

export default People;
