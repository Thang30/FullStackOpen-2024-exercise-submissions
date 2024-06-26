import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAllPeople = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
};

const addPerson = async (newPerson) => {
  try {
    const response = await axios.post(baseUrl, newPerson);
    return response.data;
  } catch (error) {
    console.error('Error adding person:', error);
    throw error;
  }
};

const updatePerson = async (id, updatedPerson) => {
  const url = `${baseUrl}/${id}`;
  try {
    const response = await axios.put(url, updatedPerson);
    return response.data;
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;
  }
};

const deletePerson = async (id) => {
  const url = `${baseUrl}/${id}`;
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
};

export default { getAllPeople, addPerson, updatePerson, deletePerson };
