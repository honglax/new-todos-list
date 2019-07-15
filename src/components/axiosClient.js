const axios = require('axios');

const axiosInstance = axios.create({
    // Set default url for Axios
    baseURL: 'https://todos-api-server.herokuapp.com/items'
});

module.exports = axiosInstance;
