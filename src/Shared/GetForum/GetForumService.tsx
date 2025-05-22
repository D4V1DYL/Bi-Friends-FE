import axios from "axios";
import { baseURL } from "../../../environment";
import ChatService from "../Chat/ChatService";

const GetForumService = {
  getAllForums: async () => {
    const token = ChatService.getToken()
    if (!token) throw new Error('User is not authenticated')
    const response = await axios.get(`${baseURL}list-forums`);
    return response.data;
  }
};

export default GetForumService;
