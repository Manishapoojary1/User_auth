import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change if your backend runs on another port
  withCredentials: true, // use this if you're using cookies (optional)
});

export default API;
