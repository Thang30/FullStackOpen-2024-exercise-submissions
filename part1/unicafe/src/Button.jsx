const Button = ({ feedbackType, handleClick }) => {
  return (
    <button onClick={() => handleClick(feedbackType)}>
      {feedbackType}
    </button>
  );
};

export default Button;
