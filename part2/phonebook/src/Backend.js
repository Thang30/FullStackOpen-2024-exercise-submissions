import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAllPeople = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

const updatePerson = (id, updatedPerson) => {
  const url = `${baseUrl}/${id}`;
  return axios.put(url, updatedPerson).then(response => response.data);
};

const deletePerson = (id) => {
  const url = `${baseUrl}/${id}`;
  return axios.delete(url).then(response => response.data);
};

export default { getAllPeople, addPerson, updatePerson, deletePerson };
