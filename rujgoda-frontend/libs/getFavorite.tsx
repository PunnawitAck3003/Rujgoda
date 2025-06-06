import axios from "axios"
import { Favorites } from "../interface";

export default async function getFavorite(token: string): Promise<Favorites>{
    const apiUrl = `http://localhost:5000/api/v1/favorites`;
    const response= await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          "authorization": `Bearer ${token}`,
        }
      })
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    
    return await response.data.data
}