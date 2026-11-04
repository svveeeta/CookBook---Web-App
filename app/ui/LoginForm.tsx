"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Link from "next/link";

export default function LoginForm() {
    const { login } = useUser();
    const router = useRouter();

    // const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password.length < 6) {
            setError("Пароль должен содержать не менее 6 символов");
            return;
          }
        
        setError("");

        console.log("Форма отправлена");

        // Учебная авторизация
        login(email);

        // После входа переходим на главную
        router.push("/start");
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Вход</h2>

            {/* <div className="form-field">
                <label>
                    Имя
                    <input 
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </label>
            </div> */}

            <div className="form-field">
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
            </div>

            <div className="form-field">
                <label htmlFor="password">
                    Пароль
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                    setPassword(event.target.value)
                    }
                    minLength={6}
                    required
                />

                <span className="password-hint">
                    Минимум 6 символов
                </span>

                {error && (
                    <p className="form-error" role="alert">
                    {error}
                    </p>
                )}
            </div>

            <button  className="auth-button" type="submit">
                Войти
            </button>

            <p className="auth-link">
                Нет аккаунта?{" "}
                <Link href="/register">
                    Зарегистрироваться
                </Link>
            </p>
        </form>
    )
};