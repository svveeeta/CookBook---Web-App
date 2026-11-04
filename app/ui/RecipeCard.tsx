"use client";

import Link from "next/link"
import Image from "next/image";
import {useUser} from "../context/UserContext";

// задание типов через TS
type RecipeCardProps = {
    id: string;
    title: string;
    description: string;
    active_time: string;
    time: string;
    image: string;
    imageAlt: string;
    priority?: boolean;
};

// создание компонента
export default function RecipeCard ({
    id,
    title,
    description,
    active_time,
    time,
    image,
    imageAlt,
    priority,
}: RecipeCardProps) {
    console.log("Карточка:", title, "Изображение:", image);

    const { user, favorites, toggleFavorite } = useUser();

    // Проверяем, находится ли рецепт в избранном
    const isFavorite = favorites.includes(id);

    return (
        <article className="recipe-card">
            <Link href={`/images/${id}`} className="recipe-image-wrapper">
                <Image 
                    src={image}
                    alt={imageAlt}
                    width={400}
                    height={250}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="recipe-image"
                    priority={priority}
                    
                />
            </Link>
            
            <div className="recipe-content">
                <div className="recipe-header">
                    <h3>{title}</h3>

                    {/* Кнопка избранного (только для авторизованных) */}
                    {user && (
                        <button 
                            onClick={() => toggleFavorite(id)} 
                            className={`favorite-btn ${isFavorite ? "active" : ""}`}
                            title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                        >
                            {isFavorite ? "❤️" : "🤍"}
                        </button>
                    )}
                </div>             
                
                <p className="recipe-desc">{description}</p>
                
                <div className="recipe-meta">
                    <p><span>Активная готовка:</span> {active_time}</p>
                    <p><span>Общее время:</span> {time}</p>
                </div>          

                {/* Ссылка на страницу конкретного рецепта */}
                <Link href={`/recipes/${id}`} className="recipe-btn">
                    Подробнее
                </Link>
            </div>
        </article>
    );
} 
