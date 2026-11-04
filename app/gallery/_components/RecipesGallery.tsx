
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Recipe } from "../../data/recipes";
import PhotoModal from "./PhotoModal";
import styles from "./RecipesGallery.module.css";

type PlacesGalleryProps = {
    recipes: Recipe[];
};

export default function PlacesGallery({
    recipes,
}: PlacesGalleryProps) {
    const [selectedRecipe, setSelectedRecipe] =
        useState<Recipe | null>(null);

    const openerRef = useRef<HTMLButtonElement | null>(null);

    const closeModal = useCallback(() => {
        setSelectedRecipe(null);
    }, []);

    // Возвращаем фокус на кнопку после закрытия окна.
    useEffect(() => {
        if (selectedRecipe === null) {
            openerRef.current?.focus();
        }
    }, [selectedRecipe]);

    return (
        <>
            <div className={styles.gallery}>
                {recipes.map((recipe, index) => (
                    <button
                        key={recipe.id}
                        type="button"
                        className={styles.card}
                        onClick={(event) => {
                            openerRef.current = event.currentTarget;
                            setSelectedRecipe(recipe);
                        }}
                        aria-haspopup="dialog"
                        aria-label={`Открыть фотографию: ${recipe.title}`}
                        
                    >
                        <Image
                            src={recipe.image}
                            alt={recipe.imageAlt}
                            width={400}
                            height={280}
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 3}
                        />

                        <span className={styles.cardTitle}>
                            {recipe.title}
                        </span>

                        <span className={styles.description}>
                            {recipe.description}
                        </span>
                    </button>
                ))}
            </div>

            {selectedRecipe && (
                <PhotoModal
                    recipe={selectedRecipe}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
