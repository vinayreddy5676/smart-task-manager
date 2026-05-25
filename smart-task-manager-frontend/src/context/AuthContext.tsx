import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    userEmail: string | null;
    loginUser: (token: string, email: string) => void;
    logoutUser: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );
    const [userEmail, setUserEmail] = useState<string | null>(
        localStorage.getItem('userEmail')
    );

    const loginUser = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        setToken(token);
        setUserEmail(email);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setToken(null);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            userEmail,
            loginUser,
            logoutUser,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};