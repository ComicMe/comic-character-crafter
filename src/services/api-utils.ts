import axios from 'axios';


const baseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:8000/"
    }
    if (process.env.NODE_ENV === "production") {
        return "https://comic-8dve.onrender.com/"
    }
}
export const API_BASE_URL = baseUrl()

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleAxiosError = (error: any) => {
    if (error?.isAxiosError) {
        console.error('Axios error:', error.response?.data || error.message);
        throw error.response?.data || error;
    } else {
        console.error('Unexpected error:', error);
        throw error;
    }
};






export const createComics = async (data: any) => {
    try {
      // Créer un objet FormData
      const formData = new FormData();
  
      // Parcourir toutes les clés de l'objet data et les ajouter à formData
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (Array.isArray(value)) {
          // Si c'est un tableau (par exemple, pour plusieurs fichiers), on ajoute chaque élément
          value.forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      // Envoyer la requête avec le formData, le backend attend du multipart/form-data
      const response = await apiClient.post('/create-comic/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data; // Retourne la réponse en cas de succès
    } catch (error) {
      handleAxiosError(error);
    }
  };
  



export const getComics = async (id:string) => {
    try {
        const response = await apiClient.get('/get_comics/'+id);
        return response.data; // Retourne la réponse en cas de succès

    } catch (error) {
        handleAxiosError(error);
    }

}

export const getcomicByID = async (id:string) => {
    try {
        const response = await apiClient.get('/get_comic/'+id);
        return response.data; // Retourne la réponse en cas de succès

    } catch (error) {
        handleAxiosError(error);
    }

}

