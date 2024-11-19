const axios = require('axios');

const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=b5382e81';

describe('API Integration Tests', () => {
  
  test('should return 200 for valid endpoint', async () => {
    const response = await axios.get(`${BASE_URL}&s=Harry`);
    expect(response.status).toBe(200);
  });

  test('should return correct data structure for valid request', async () => {
    const response = await axios.get(`${BASE_URL}&s=Harry`); 
    expect(response.data).toHaveProperty('Search');
  });

  test('should return 404 for invalid endpoint', async () => {
    try {
      await axios.get(`${BASE_URL}&=invalid`); 
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('should return error message for missing required parameters', async () => {
    try {
      await axios.get(`${BASE_URL}`); 
    } catch (error) {
      expect(error.response.status).toBe(200); 
      expect(error.response.data).toHaveProperty('Response', 'False');
      expect(error.response.data).toHaveProperty('Error');
    }
  });
  
  test('should return error message for invalid search term', async () => {
    const response = await axios.get(`${BASE_URL}&s=invalidName`); 
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('Response', "False");
    expect(response.data).toHaveProperty('Error', 'Movie not found!');
  });
});
