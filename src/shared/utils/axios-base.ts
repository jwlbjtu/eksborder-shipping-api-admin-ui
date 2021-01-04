import axios from 'axios';
import { DEFAULT_SERVER_HOST } from './constants';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://react-my-burger-8c6a0.firebaseio.com/'
      : DEFAULT_SERVER_HOST
});

export default instance;
