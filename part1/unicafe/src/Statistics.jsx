const Statistics = ({ good, neutral, bad, totalFeedback, averageScore, positivePercentage }) => {
  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>Total Feedback: {totalFeedback}</p>
      <p>Average Score: {averageScore}</p>  
      <p>Positive Feedback (%): {positivePercentage}</p> 
    </div>
  );
};

export default Statistics;
