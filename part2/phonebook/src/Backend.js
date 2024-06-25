import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAllPeople = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const addPerson = async (newPerson) => {
  const response = await axios.post(baseUrl, newPerson);
  return response.data;
};

const updatePerson = async (id, updatedPerson) => {
  const url = `${baseUrl}/${id}`; // Construct URL with id
  const response = await axios.put(url, updatedPerson);
  return response.data;
};

export default { getAllPeople, addPerson, updatePerson };
