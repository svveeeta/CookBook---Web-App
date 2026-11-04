
"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Recipe } from "../../data/recipes";
import styles from "./PhotoModal.module.css";

type PhotoModalProps = {
    recipe: Recipe;
    onClose: () => void;
};

export default function PhotoModal({
    recipe,
    onClose,
}: PhotoModalProps) {
    const [mounted, setMounted] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Ждём монтирования компонента в браузере.
    // useEffect(() => {
    //     setMounted(true);
    // }, []);
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const previousOverflow = document.body.style.overflow;

        // Запрещаем прокрутку страницы под окном.
        document.body.style.overflow = "hidden";

        // Переносим начальный фокус внутрь окна.
        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            const focusableElements = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (element) =>
                    element.getAttribute("aria-hidden") !== "true"
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusableElements[0];
            const last =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup: удаляем обработчик и возвращаем прокрутку.
        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
            document.body.style.overflow = previousOverflow;
        };
    }, [mounted, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                // Закрываем только при нажатии на сам фон.
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="photo-modal-title"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Закрыть окно"
                >
                    ×
                </button>

                <h2 id="photo-modal-title">
                    {recipe.title}
                </h2>

                <Image
                    src={recipe.image}
                    alt={recipe.imageAlt}
                    width={900}
                    height={650}
                    className={styles.image}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                />

                <h4>Ингредиенты</h4>
                {recipe.ingredients.map((group, index) => (
                    <div key={index}>
                        {group.title && <h3>{group.title}</h3>}

                        <ul>
                            {group.items.map((ingredient, itemIndex) => (
                                <li key={itemIndex}>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>,
        document.body
    );
}
