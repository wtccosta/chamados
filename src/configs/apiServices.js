import axios from 'axios'

async function apiPublic() {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const splited = response.data.ip.split('.')
    const url = splited[0] == '172' ? 'http://172.16.0.35:8181/teleman/api' : 'http://187.6.254.170:8181/teleman/api';
    console.log(splited);
    // const url = 'http://187.6.254.170:8181/teleman/api';
    //const url = 'http://localhost:8080/api'
     return axios.create({
        baseURL: url,
        timeout: 50000
    });
}


async function apiProtected() {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const splited = response.data.ip.split('.')
    const url = splited[0] == '172' ? 'http://172.16.0.35:8181/teleman/api' : 'http://187.6.254.170:8181/teleman/api';
    // const url = 'http://187.6.254.170:8181/teleman/api';
   //const url = 'http://localhost:8080/api'
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