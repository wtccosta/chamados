import axios from 'axios'
import {URI_BASE_API} from './api'


const apiPublic = axios.create({
    baseURL: URI_BASE_API,
    timeout: 50000
});


const apiProtected = axios.create({
    baseURL: URI_BASE_API,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json', 
         'Authorization': localStorage.getItem('session_token')
    }
});

export {apiPublic, apiProtected}