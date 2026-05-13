import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';

type UserRole = 'ADMIN' | 'Cliente' | 'Empresa';

interface AuthUser {
    token: string,
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null,
    login: (token: string, role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) =>{
    const [user, setUser] = useState<AuthUser | null>(() => {
        const token  = localStorage.getItem('token');
        const role = localStorage.getItem('role') as UserRole | null;
        return token && role ? { token, role } : null;
    });

    const login = (token: string, role: UserRole ) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ token, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error ('useAuth debe usarse dentro de AuthProvider ');
    return ctx;
};