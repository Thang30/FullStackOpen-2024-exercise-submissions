const Total = ({ parts }) => {
  const totalExercises = parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0);
  return <p>Number of exercises {totalExercises}</p>;
};

export default Total;