"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeCard from "../ui/RecipeCard";
import type { Recipe } from "../data/recipes";

type RecipeCatalogProps = {
    recipes: Recipe[];
};

const STORAGE_KEY = "cookbook-selected-recipes";

export default function RecipeCatalog({ recipes }: RecipeCatalogProps) {
    // Ленивая инициализация: читаем данные из localStorage один раз при старте
    const [selectedIds, setSelectedIds] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
                        // Фильтруем только те ID, которые реально есть в каталоге
                        return parsed.filter((id) => recipes.some((recipe) => recipe.id === id));
                    }
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        return [];
    });

    function toggleRecipe(id: string) {
        setSelectedIds((current) => {
            const next = current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id];
            
            // Сразу сохраняем в localStorage, чтобы не использовать useEffect
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }

    return (
        <section>
            <div className="shopping-selection">
                <p>
                    Выбрано рецептов: {selectedIds.length}
                </p>

                <Link href="/shopping-list">
                    Составить список покупок
                </Link>
            </div>

            <div className="recipes-grid">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="recipe-select-item">
                        <label className="recipe-select-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(recipe.id)}
                                onChange={() => toggleRecipe(recipe.id)}
                                // Убрали disabled={!isLoaded}
                            />
                            Добавить в список покупок
                        </label>

                        <RecipeCard
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            active_time={recipe.active_time}
                            time={recipe.time}
                            image={recipe.image}
                            imageAlt={recipe.imageAlt}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}