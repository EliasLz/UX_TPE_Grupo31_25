import { mockGame } from "./mock.js";

//Fetching de datos de la API"

const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2';

export async function fetchGames() {
    try{
        const response = await fetch(`${API_URL}`);
        if(!response.ok){
            throw new Error('Error al obtener los juegos');
        }

        let data = await response.json();
        data = data.concat(mockGame); //--> Introducimos a Peg Solitarie y BLOCKA en el array de juegos.

        return data;
    }catch(e){
        console.error('Hubo un error al obtener los juegos');
        console.error(e);
        throw e;
    }
}