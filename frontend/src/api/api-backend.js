import axios from 'axios';

const BASE_URL = "http://localhost:3000";

export class BackendAPI {

    static async getAllUsers() {
    //     const response = await axios.get(`${BASE_URL}/users/2`);
    //     console.log(response.data);
    //     return response.data;
        fetch('http://127.0.0.1:3000/users')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Utilisez les données retournées ici
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
    }

}