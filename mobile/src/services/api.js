import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:3333',
  baseURL: 'http://10.0.2.2:3333', // emulador android
  //baseURL: 'http://10.0.3.2:3333', // genimotion
  //baseURL: 'http://IP_DA_REDE:3333', // usb
});

export default api;
