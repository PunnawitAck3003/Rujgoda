import axios from "axios"
import { User } from "../interface";

export default async function getMe(token: string): Promise<User>{
    const apiUrl = `http://localhost:5000/api/v1/auth/me`;
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