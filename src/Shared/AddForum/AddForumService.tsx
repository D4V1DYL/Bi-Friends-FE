import axios from "axios";
import { baseURL } from "../../../environment";
import { ForumInput } from "./AddForumTypes";

const AddForumService = {
  createForum: async (data: ForumInput, token: string) => {
    const response = await axios.post(`${baseURL}create_forum`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  },
};

export default AddForumService;
