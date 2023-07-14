import axios from "axios";

export const http = axios.create({
  baseURL: 'https://api-laravel-grupoa.herokuapp.com/api/'
})