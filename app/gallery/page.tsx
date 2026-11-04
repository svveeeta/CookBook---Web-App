
import { recipes } from "../data/recipes";
import RecipesGallery from "./_components/RecipesGallery";

export default function GalleryPage() {
    return (
        <main>
            <h1>Галерея рецептов</h1>
            <p>
                Рассмотрите блюда поближе и выбери,
                что приготовить.
            </p>

            <RecipesGallery recipes={recipes} />
        </main>
    );
}
