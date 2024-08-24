import axios from "axios";
import { Images } from "../../types/images";

const ACCESS_KEY = 'nTSaLnkrCBk5_h_xtUGEUPU6WfrzjblX0apdeR4fN84';

interface Response {
    response: Images[];
}
const fetchImages = async (query:string, page:number = 0):Promise<Response> => {
    try {
        const response = await axios.get(
            `https://api.unsplash.com/search/photos`, {
            params: {
                client_id: ACCESS_KEY,
                query,
                page,
            },
        }
        );
        return response.data.results;
        
    } catch (error: unknown) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

export default fetchImages;
