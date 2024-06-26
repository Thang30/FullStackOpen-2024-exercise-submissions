const People = ({ people, onDelete }) => {
  return (
    <ul>
      {people.map(person => (
        <li key={person._id}>
          {/* <div>{console.log(person)}</div> */}
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default People;
