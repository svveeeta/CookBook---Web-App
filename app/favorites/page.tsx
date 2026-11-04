"use client";

import { useUser } from "../context/UserContext";
import { recipes } from "../data/recipes";
import RecipeCard from "../ui/RecipeCard";
import Link from "next/link";

export default function FavoritesPage() {
    const { user, favorites } = useUser();

    // Если пользователь не авторизован
    if (!user) {
        return (
            <main className="container">
                <h2>Избранное</h2>
                <p>Пожалуйста, войдите в аккаунт, чтобы увидеть избранные рецепты.</p>
            </main>
        );
    }

    // Фильтруем рецепты по избранным ID
    const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

    return (
        <main className="container">
            <h2>Избранное</h2>
            
            {favoriteRecipes.length === 0 ? (
                <p>У вас пока нет избранных рецептов. Добавьте их со страницы каталога!</p>
            ) : (
                <div className="recipes-grid">
                    {favoriteRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            active_time={recipe.active_time}
                            time={recipe.time}
                            image={recipe.image}
                            imageAlt={recipe.imageAlt}
                        />
                    ))}
                </div>                
            )}
            <Link href="/recipes" className="all-recipe-btn">
                    Все рецепты →
            </Link>
        </main>
    );
}