import {io} from "socket.io-client";

const URL = 'http://192.168.78.87:3000/';

export const socket = io(URL);