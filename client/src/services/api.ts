// client/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001', // Mudei de 3000 para 3001
});