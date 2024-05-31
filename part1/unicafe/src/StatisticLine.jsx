const StatisticLine = ({ label, value }) => {
  return (
    <tr>
      <th>{label}</th>
      <td className={isNaN(value) ? '' : 'numeric'}>{value}</td> 
    </tr>
  );
};

export default StatisticLine;
