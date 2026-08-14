import axios from 'axios';

const BASE_URL = '';

const api = axios.create({
    baseURL: BASE_URL,
});

// ✅ Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Auth APIs
export const login = (email: string, password: string) =>
    api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password });

// ✅ Task APIs
export const getTasks = () =>
    api.get('/api/tasks');

export const addTask = (task: any) =>
    api.post('/api/tasks', task);

export const updateTask = (id: number, task: any) =>
    api.put(`/api/tasks/${id}`, task);

export const deleteTask = (id: number) =>
    api.delete(`/api/tasks/${id}`);

export const completeTask = (id: number) =>
    api.patch(`/api/tasks/${id}/complete`);

export const getTasksByPriority = (priority: string) =>
    api.get(`/api/tasks/priority/${priority}`);

export const getTasksByStatus = (status: string) =>
    api.get(`/api/tasks/status/${status}`);

export const searchTasks = (keyword: string) =>
    api.get(`/api/tasks/search/${keyword}`);

export default api;
