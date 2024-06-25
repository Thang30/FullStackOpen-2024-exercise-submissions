const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input type="text" placeholder="search names..." value={value} onChange={onChange} />
  </div>
);

export default Filter;
