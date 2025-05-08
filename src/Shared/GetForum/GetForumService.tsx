import axios from "axios";
import { baseURL } from "../../../environment";

const GetForumService = {
  getAllForums: async () => {
    const response = await axios.get(`${baseURL}list-forums`);
    return response.data;
  }
};

export default GetForumService;
