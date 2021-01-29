import axios from 'axios'

async function apiPublic() {
    const response = await axios.get('https://cors-anywhere.herokuapp.com/https://api64.ipify.org?format=json');
    const splited = response.data.ip.split('.')
    const url = splited[0] == '172' ? 'https://cors-anywhere.herokuapp.com/http://172.16.0.35:8181/teleman/api' : 'https://cors-anywhere.herokuapp.com/http://187.6.254.170:8181/teleman/api';
    console.log('setUrl: ', url);
    return axios.create({
        baseURL: url,
        timeout: 50000
    });
}


async function apiProtected() {
    const response = await axios.get('https://cors-anywhere.herokuapp.com/https://api64.ipify.org?format=json');
    const splited = response.data.ip.split('.')
    const url = splited[0] == '172' ? 'https://cors-anywhere.herokuapp.com/http://172.16.0.35:8181/teleman/api' : 'https://cors-anywhere.herokuapp.com/http://187.6.254.170:8181/teleman/api';
    return axios.create({
        baseURL: url,
        timeout: 50000,
    headers: {
        'Content-Type': 'application/json', 
         'Authorization': localStorage.getItem('session_token')
    }
    });
}



export {apiPublic, apiProtected}