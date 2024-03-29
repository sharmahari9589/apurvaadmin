import axios from 'axios'
import Cookies from 'js-cookie';
import config from './config/config';
const loginData = (!Cookies.get('loginSuccessFarfetchAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessFarfetchAdmin'));
const serverPath = config.serverPath;

export const request = (path, data, method) => {
    try {
        var options = {
            method: method,
            url: `${serverPath}/${path}`,
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        };
        if (loginData) {
            options.headers['Authorization'] = loginData?.authToken
        }
        if (method === 'GET') {
            options['params'] = data
        } else {
            options['data'] = data
        }

        
        let res = axios(options)
       
        res.then(res => { })
        return res
    } catch (error) {
        // return res.status(500).send({success: false})
        console.log('errr',error)
    }
   
}

export const requestFormData =  (path, data, method) => {
    var form_data = new FormData();
    for (var key in data) {
        form_data.append(key, data[key]);
    }
    var options = {
        method: method,
        url: `${serverPath}/${path}`,
        data: form_data,
        headers: { authorization: loginData?.authToken },
    };
    let res =  axios(options);
    res.then(res1 => { })
    return res
}

export const postRequest = async (path, data) => await request(path, data, 'POST')
export const PutRequest = async (path, data) => await request(path, data, 'PUT')
export const deleteRequest = async (path, data) => await request(path, data, 'DELETE')
export const getRequest = async (path, data) => await request(path, data, 'GET')
export const postRequestFormData = async (path, data) => await requestFormData(path, data, 'POST')
export const putRequestFormData = async (path, data) => await requestFormData(path, data, 'PUT')
