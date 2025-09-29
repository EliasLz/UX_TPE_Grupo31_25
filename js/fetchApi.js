//Fetching de datos de la API
const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2';

export async function fetchGames() {
    try{
        const response = await fetch(`${API_URL}`);
        if(!response.ok){
            throw new Error('Error al obtener los juegos');
        }

        const data = await response.json();
        console.log(data)
        return data;
    }catch(e){
        console.error('Hubo un error al obtener los juegos');
        console.error(e);
    }
}