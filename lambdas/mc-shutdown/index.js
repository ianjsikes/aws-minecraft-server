const axios = require('axios');

const mcApi = axios.create({
  baseURL: 'https://api.mc.ianjsikes.com/',
  headers: { 'Content-Type': 'application/json' },
});

exports.handler = async event => {
  console.log('Attempting to STOP server...');
  try {
    const response = await mcApi.post('/stop');
    console.log(response.data);

    if (response.status === 200) {
      console.log('Server STOP request success');
    } else {
      console.error(
        'Server STOP request failure',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(error);
  }
};
