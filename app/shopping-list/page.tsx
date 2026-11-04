"use client";

import { useState } from "react";
import Link from "next/link";
import { recipes } from "../data/recipes";
import styles from "./page.module.css"; // <--- Импорт стилей

const RECIPES_KEY = "cookbook-selected-recipes";
const CHECKED_KEY = "cookbook-checked-ingredients";

function getFromStorage(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
            return parsed;
        }
    } catch {
        localStorage.removeItem(key);
    }
    return [];
}

export default function ShoppingListPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>(() => getFromStorage(RECIPES_KEY));
    const [checkedItems, setCheckedItems] = useState<string[]>(() => getFromStorage(CHECKED_KEY));

    const selectedRecipes = recipes.filter((recipe) =>
        selectedIds.includes(recipe.id)
    );

    const ingredients = Array.from(
        new Set(
            selectedRecipes.flatMap((recipe) =>
                recipe.ingredients.flatMap((group) => group.items)
            )
        )
    );

    function toggleIngredient(item: string) {
        setCheckedItems((current) => {
            const next = current.includes(item)
                ? current.filter((ingredient) => ingredient !== item)
                : [...current, item];
            localStorage.setItem(CHECKED_KEY, JSON.stringify(next));
            return next;
        });
    }

    function removeRecipe(id: string) {
        const nextIds = selectedIds.filter(
            (recipeId) => recipeId !== id
        );
        setSelectedIds(nextIds);
        localStorage.setItem(RECIPES_KEY, JSON.stringify(nextIds));
    }

    function clearList() {
        setSelectedIds([]);
        setCheckedItems([]);
        localStorage.setItem(RECIPES_KEY, JSON.stringify([]));
        localStorage.setItem(CHECKED_KEY, JSON.stringify([]));
    }

    return (
        <main className={styles.container}>
            <h2 className={styles.title}>Список покупок</h2>
            <p className={styles.subtitle}>
                Ингредиенты для выбранных рецептов в одном месте.
            </p>

            {selectedRecipes.length === 0 ? (
                <section className={styles.emptyState}>
                    <p>Вы пока не выбрали ни одного рецепта.</p>
                    <Link href="/recipes" className={styles.primaryBtn}>
                        Перейти в каталог рецептов
                    </Link>
                </section>
            ) : (
                <>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Выбранные рецепты</h3>

                        <ul className={styles.recipeList}>
                            {selectedRecipes.map((recipe) => (
                                <li key={recipe.id} className={styles.recipeItem}>
                                    <span>{recipe.title}</span>
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => removeRecipe(recipe.id)}
                                    >
                                        Убрать
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <Link href="/recipes" className={styles.primaryBtn}>
                            Добавить другие рецепты
                        </Link>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Необходимые ингредиенты</h3>

                        <p className={styles.progressText}>
                            Куплено:{" "}
                            {ingredients.filter((item) => checkedItems.includes(item)).length}{" "}
                            из {ingredients.length}
                        </p>

                        <ul className={styles.ingredientsList}>
                            {ingredients.map((item) => {
                                const isChecked = checkedItems.includes(item);
                                return (
                                    <li 
                                        key={item} 
                                        className={`${styles.ingredientItem} ${isChecked ? styles.checked : ""}`}
                                    >
                                        <label style={{ display: "flex", width: "100%", alignItems: "center", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={isChecked}
                                                onChange={() => toggleIngredient(item)}
                                            />
                                            <span 
                                                className={styles.ingredientText}
                                                style={{ textDecoration: isChecked ? "line-through" : "none" }}
                                            >
                                                {item}
                                            </span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>

                        <button type="button" className={styles.dangerBtn} onClick={clearList}>
                            Очистить список
                        </button>
                    </section>
                </>
            )}
        </main>
    );
}