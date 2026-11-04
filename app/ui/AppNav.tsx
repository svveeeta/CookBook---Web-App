"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import styles from "./AppNav.module.css";

export default function AppNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useUser();

  // Список ссылок для меню
  const links = [
    { href: "/", label: "Главная" },
    { href: "/recipes", label: "Рецепты" },
    { href: "/gallery", label: "Галерея" },
    { href: "/nearby-stores", label: "Магазины" },
];

  // Ссылки, которые видны только авторизованным
  const authLinks = [
      { href: "/favorites", label: "Избранное" },
      { href: "/my-recipes", label: "Мои рецепты" },
      { href: "/shopping-list", label: "Список покупок" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return(
    <>
      {/* Кнопка бургера */}    
      <button 
          className={`${styles.burgerBtn} ${isOpen ? styles.open : ""}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Меню"
      >
        <div className={styles.burgerLines}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

        {/* Затемнение фона при открытом меню */}
        {isOpen && <div className={styles.menuOverlay} onClick={toggleMenu}></div>}

        {/* Само боковое меню */}
        <nav className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}>
            <ul>
                {links.map((link) => (
                    <li key={link.href}>
                        <Link 
                            href={link.href} 
                            onClick={() => setIsOpen(false)} // Закрываем меню при клике
                            className={pathname === link.href ? styles.active : ""}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}

                {/* Разделитель для авторизованных ссылок */}
                {user && (
                    <>
                        <li className={styles.menuDivider}></li>
                        {authLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href} 
                                    onClick={() => setIsOpen(false)}
                                    className={pathname === link.href ? styles.active : ""}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </>
                )}
                
                {/* Блок кнопок авторизации */}
                <li className={styles.menuDivider}></li>
                {user ? (
                    <li>
                        <button className={styles.logoutBtn} onClick={() => { logout(); setIsOpen(false); }}>
                            Выйти ({user.name})
                        </button>
                    </li>
                ) : (
                    <li>
                        <Link href="/login" onClick={() => setIsOpen(false)} className={styles.loginBtn}>
                            Войти
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    </>
  );


  // return (
  //   <nav className="navigation">
  //     <Link
  //       href="/start"
  //       className="nav-link"
  //       aria-current={pathname === "/start" ? "page" : undefined}
  //     >
  //       Главная
  //     </Link>

  //     <Link
  //       href="/recipes"
  //       className="nav-link"
  //       aria-current={
  //         pathname.startsWith("/recipes") ? "page" : undefined
  //       }
  //     >
  //       Рецепты
  //     </Link>

  //     <Link href="/gallery"
  //       className="nav-link"
  //       aria-current={
  //         pathname.startsWith("/gallery") ? "page" : undefined
  //       }>Галерея
  //     </Link>

  //     {user && (
  //       <>
  //         <Link
  //           href="/favorites"
  //           className="nav-link"
  //           aria-current={
  //             pathname === "/favorites" ? "page" : undefined
  //           }
  //         >
  //           Избранное
  //         </Link>

  //         <Link
  //           href="/my-recipes"
  //           className="nav-link"
  //           aria-current={
  //             pathname === "/my-recipes" ? "page" : undefined
  //           }
  //         >
  //           Мои рецепты
  //         </Link>

  //         <Link
  //           href="/shopping-list"
  //           className="nav-link"
  //           aria-current={
  //             pathname === "/shopping-list" ? "page" : undefined
  //           }
  //         >
  //           Список покупок
  //         </Link>
  //       </>
  //     )}

  //     <Link
  //       href="/about"
  //       className="nav-link"
  //       aria-current={pathname === "/about" ? "page" : undefined}
  //     >
  //       О проекте
  //     </Link>
  //   </nav>
  // );
}