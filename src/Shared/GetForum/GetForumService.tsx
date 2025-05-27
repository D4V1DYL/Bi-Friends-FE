import axios from "axios";
import { baseURL } from "../../../environment";

const GetForumService = {
  getAllForums: async (token: string) => {
    try {
      const response = await axios.get(`${baseURL}Forum/list-forums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // ← hanya ambil array forum
    } catch (error) {
      console.error("Gagal mengambil forum:", error);
      throw error;
    }
  },
};

export default GetForumService;
