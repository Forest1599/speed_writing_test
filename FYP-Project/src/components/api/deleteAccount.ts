import api from "./api";

const deleteAccount = async () => {
  const response = await api.delete('/api/user/delete-account/');
  return response.data;
};

export default deleteAccount;