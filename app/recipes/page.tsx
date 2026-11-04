import {recipes} from "../data/recipes";
import RecipeCatalog from "./RecipeCatalog";

export default function RecipesPage() {
    return (
        <main>
            <h2>Рецепты</h2>
            <p>Каталог рецептов</p>
            <p>Здесь собраны рецепты, которые можно приготовить дома.</p>

            <div>
                <RecipeCatalog recipes={recipes} />
            </div>
        </main>
    )
}