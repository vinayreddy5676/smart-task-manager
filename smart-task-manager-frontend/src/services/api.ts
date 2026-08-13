import axios from 'axios';

const BASE_URL = 'http://13.211.143.243:8080';

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
    api.get('/tasks');

export const addTask = (task: any) =>
    api.post('/tasks', task);

export const updateTask = (id: number, task: any) =>
    api.put(`/tasks/${id}`, task);

export const deleteTask = (id: number) =>
    api.delete(`/tasks/${id}`);

export const completeTask = (id: number) =>
    api.patch(`/tasks/${id}/complete`);

export const getTasksByPriority = (priority: string) =>
    api.get(`/tasks/priority/${priority}`);

export const getTasksByStatus = (status: string) =>
    api.get(`/tasks/status/${status}`);

export const searchTasks = (keyword: string) =>
    api.get(`/tasks/search/${keyword}`);

export default api;
