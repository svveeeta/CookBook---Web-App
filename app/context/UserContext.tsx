"use client";

import { createContext, useContext, useState } from "react";

// Описываем данные, которые будем хранить о пользователе
type User = {
    name: string;
    email: string;
  };

// Описываем, что будет доступно через контекст
type UserContextType = {
    user: User | null;
    login: ( email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
    favorites: string[];
    toggleFavorite: (id: string) => void;
}

// Создаем контекст польз-ля
const UserContext = createContext<UserContextType | undefined>(undefined);

// Создаем компонент-провайдер
export function UserProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // user = null - польз-ль не авторизован, состояние пользователя.
    const [user, setUser] = useState<User | null>(null);

    // Состояние Избранного (сбрасывается при обновлении страницы)
    const [favorites, setFavorites] = useState<string[]>([]);

    // Учебная функция входа
    const login = (email: string) => {
        const name = email.split("@")[0];
      
        setUser({
          name,
          email,
        });
      };
    // const login = (name: string, email: string) => {
    //     setUser({
    //         name,
    //         email,
    //     });
    // };

    const register = (name: string, email: string) => {
        setUser({
          name,
          email,
        });
      };
    

    // Выход пользователя
    const logout = () => {
        setUser(null);
        setFavorites([]); // При выходе очищет избранное
    };

    // Избранное
    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
 
    return (
        <UserContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                favorites,
                toggleFavorite
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

// Создаем удобный хук для использования контекста
export function useUser() {
    const context = useContext(UserContext);

    if(!context) {
        throw new Error(
            "useUser должен использоваться внутри UserProvider"
        );
    }

    return context;
}