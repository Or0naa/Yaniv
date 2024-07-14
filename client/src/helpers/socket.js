import { io } from 'socket.io-client';

// const URL = 'http://localhost:3000';
const URL = "https://yaniv-7rgh.onrender.com"
export const socket = io(URL, {
  // autoConnect: false,
});
