"use client";

import Link from "next/link";
import AppNav from "./AppNav";

export default function Header() {
  // const { user, logout } = useUser();

  return (
    <header className="header">
      <div className="header-container">

        <Link href="/start" className="logo">
          CookBook
        </Link>

        <AppNav />

        {/* <div className="user-menu">
          {user ? (
            <>
              <span className="user-greeting">
                Привет, {user.name}!
              </span>

              <button
                className="logout-button"
                onClick={logout}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" className="login-button">
              Войти
            </Link>
          )}
        </div> */}

      </div>
    </header>
  );
}