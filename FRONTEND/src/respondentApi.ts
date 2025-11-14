import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/responden`;

const respondenApi = {
  async getAll() {
    const res = await axios.get(API_URL);
    return res.data;
  },
  async create(data:any) {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  async uploadExcel(file:any) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/excel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async update(id:number, data:any) {
    const res = await axios.patch(`${API_URL}/${id}`, data);
    return res.data;
  },
  async remove(id:number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};

// ⬅️ pastikan menggunakan "export default"
export default respondenApi;
