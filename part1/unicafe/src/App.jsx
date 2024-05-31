import { useState } from 'react';
import Button from './Button';
import StatisticLine from './StatisticLine';
import './styles.css'; 
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [hasFeedback, setHasFeedback] = useState(false);

  const handleFeedback = (feedbackType) => {
    switch (feedbackType) {
      case 'good':
        setGood(good + 1);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      case 'bad':
        setBad(bad + 1);
        break;
    }
    setHasFeedback(true);
  };

  const totalFeedback = good + neutral + bad;
  const averageScore = (good - bad) / totalFeedback || 0;
  const positivePercentage = (good / totalFeedback) * 100 || 0;

  return (
    <div>
      <h2>Give Feedback</h2>
      <Button feedbackType="good" handleClick={handleFeedback} />
      <Button feedbackType="neutral" handleClick={handleFeedback} />
      <Button feedbackType="bad" handleClick={handleFeedback} />
      <br />
      <br />
      <h2>Statistics</h2>
      {hasFeedback ? (
        <table>
          <tbody>
            <tr>
              <th>Statistic</th>
              <th>Value</th>
            </tr>
            <StatisticLine label="Good" value={good} />
            <StatisticLine label="Neutral" value={neutral} />
            <StatisticLine label="Bad" value={bad} />
            <StatisticLine label="Total Feedback" value={totalFeedback} />
            <StatisticLine label="Average Score" value={averageScore.toFixed(2)} />
            <StatisticLine label="Positive Feedback (%)" value={positivePercentage.toFixed(1)} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given yet.</p>
      )}
    </div>
  );
};

export default App;
