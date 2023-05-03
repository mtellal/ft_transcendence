import axios from 'axios';

import { redirect } from 'react-router-dom';

const BASE_URL = "http://localhost:3000";

export class BackendAPI {

    // static async getAllUsers() {
    //     const response = await axios.get(`${BASE_URL}/users`)
    //     console.log('111')
    //     if (response.status === 200)
    //         console.log('OK')
    //     else
    //         console.log('NOP')
    //     console.log(response.data);
    //     return response.data;
    // }

    static async getUserById(id) {
        const response = await axios.get(`${process.env.REACT_APP_BACK}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${document.cookie.split("=")[1]}`
            }
        })
        console.log(response.data);
        return response.data;
    }

    //     fetch('http://localhost:3000/users', {
    //         mode: 'no-cors'
    //       })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         // Utilisez les données retournées ici
    //     })
    //     .catch(error => {
    //         console.error('Erreur lors de la récupération des données:', error);
    //     });
    // }

    static async getUser(id) {
        fetch(`${process.env.REACT_APP_BACK}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${document.cookie.split("=")[1]}`
            }
        })
            .then(res => {
                if (!res.ok)
                    return (redirect("/signin"));
                console.log(res);
                return res.json();
            })
            .then(data => console.log(data))
            .catch(err => console.log('errorrrrr', err))
    }
}