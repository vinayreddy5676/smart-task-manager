export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    completed: boolean;
    completedAt: string | null;
    user: User | null;
}