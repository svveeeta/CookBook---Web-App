"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Link from "next/link";

export default function RegisterForm() {
  const { register } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
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

    // После регистрации сразу считаем пользователя вошедшим
    register(name, email);

    router.push("/start");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

    <div className="form-field">
      <label>
        Имя
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
    </div>

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
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
      </label>
    </div>

    <button className="auth-button" type="submit">
      Зарегистрироваться
    </button>

    <p className="auth-link">
      Уже есть аккаунт?{" "}
      <Link href="/login">
          Войти
      </Link>
    </p>
    </form>
  );
}