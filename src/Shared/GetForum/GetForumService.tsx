import axios from "axios";
import { baseURL } from "../../../environment";

const GetForumService = {
  // Fungsi mendapatkan semua forum (sudah ada sebelumnya)
  getAllForums: async (token: string) => {
    try {
      const response = await axios.get(`${baseURL}Forum/list-forums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; 
    } catch (error) {
      console.error("Gagal mengambil forum:", error);
      throw error;
    }
  },

  // Fungsi tambahan untuk delete forum
  deleteForum: async (forumId: number, token: string) => {
    try {
      const response = await axios.delete(`${baseURL}Forum/delete-forum/${forumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // respons dari backend, misal { detail: "Forum berhasil dihapus" }
    } catch (error) {
      console.error("Gagal menghapus forum:", error);
      throw error;
    }
  }
};

export default GetForumService;
