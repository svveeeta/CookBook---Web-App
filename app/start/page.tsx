import RecipeCard from "../ui/RecipeCard";
import Link from "next/link";
import { popularRecipes } from "../data/recipes";


export default function HomePage () {
    return (
        <main>
            {/* <Link href="/about" className="button">
                О проекте
            </Link> */}

            <h1>CookBook</h1>
            <h2>Веб-приложение для хранения и поиска рецептов</h2>

            <section>
                <h3>Проблема</h3>
                <p>
                    При большом количестве рецептов информация о блюдах, <br />
                    ингредиентах и способах приготовления может храниться в разных <br />
                    источниках. Из-за этого пользователю сложно быстро найти нужный <br />
                    рецепт и сохранить понравившиеся блюда в одном месте.
                </p>
            </section>
            <section>
                <h3>Целевая аудитория</h3>
                <p>
                    Люди, которые готовят дома и хотят удобно хранить,
                    искать и систематизировать рецепты.
                </p>
            </section>
            <section>
                <h3>Основные функции</h3>
                <ul>
                    <li>Просмотр и поиск рецептов по имеющимся ингредиентам с возможностью настройки строгости поиска.</li>
                    <li>Фильтрация рецептов по ситуации и времени приготовления.</li>
                    <li>Добавление ингредиентов выбранного рецепта в список покупок.</li>
                    <li>Добавление собственных рецептов.</li>
                    <li>Сохранение понравившихся рецептов в избранное.</li>
                </ul>
            </section>
            <section>
                <h3>Популярные рецепты</h3>
            
                <div className="recipes-grid">
                    {popularRecipes.map((recipe) => (
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

                <Link href="/recipes" className="all-recipe-btn">
                    Все рецепты →
                </Link>
            </section>

        </main>
    );
}