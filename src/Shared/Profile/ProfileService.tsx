import axios from 'axios';
import { baseURL } from '../../../environment';

const ProfileService = {
    getProfile: async (userId: number, token: string) => {
        const response = await axios.get(`${baseURL}profile/profile-page/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateProfile: async (
        userId: number,
        formData: FormData,
        token: string
    ) => {
        const response = await axios.put(`${baseURL}profile/profile-page/update/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default ProfileService;