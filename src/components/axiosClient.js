const axios = require('axios');

console.log(process.env.REACT_APP_BASE_URL);

const axiosInstance = axios.create({
    // Set default url for Axios
    baseURL: process.env.REACT_APP_BASE_URL
});

module.exports = axiosInstance;
