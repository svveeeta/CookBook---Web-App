import Image from "next/image";
import { notFound } from "next/navigation";
import { recipes } from "../../data/recipes";

type RecipePageProps = {
    params: Promise<{
        id: string;
    }>;
};

// Экспортируем компонент страницы
export default async function RecipePage({ params }: RecipePageProps) {
     // Получаем параметры маршрута и извлекаем из них id рецепта
    const { id } = await params;
    const recipe = recipes.find((item) => item.id === id);

    if (!recipe) {
        notFound();
    }

    return (
        <main>
            <h1>{recipe.title}</h1>

            <div className="recipe-hero">
                <Image 
                    src={recipe.image} 
                    alt={recipe.imageAlt}
                    fill
                    className="recipe-hero-img"
                    priority // Загружаем картинку сразу, так как она главная на странице
                />
            </div>

            <p>{recipe.description}</p>

            <h4>Время активной готовки</h4>
            <p>{recipe.active_time}</p>

            <h4>Общее время приготовления</h4>
            <p>{recipe.time}</p>

            
            <section>
                <h2>Ингредиенты</h2>

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
            </section>

            {/* <section>
                <h2>Приготовление</h2>
                {recipe.steps}
            </section> */}


            {/* <h2>Рецепт №{id}</h2>
            <h3>Чизкейк Нью-Йорк</h3>
            <p>
                Классический американский десерт с нежной сливочной текстурой.
            </p>

            <h4>Ингредиенты</h4>
            <ul>
                <li>сливочный сыр — 600 г</li>
                <li>яйца — 3 шт.</li>
                <li>сахар — 150 г</li>
                <li>сливки — 200 мл</li>
            </ul>

            <h4>Время активной готовки</h4>
            <p>20 мин</p>

            <h3>Общее время приготовления</h3>
            <p>1 ч 30 мин</p> */}
        </main>
    )
}