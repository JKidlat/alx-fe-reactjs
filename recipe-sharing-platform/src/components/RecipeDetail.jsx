import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import data from "../data.json";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const foundRecipe = data.find((r) => r.id === parseInt(id));
    setRecipe(foundRecipe);
  }, [id]);

  if (!recipe) {
    return <p className="text-center mt-10">Recipe not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-4 text-green-600">{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="rounded-md mb-4 w-full h-64 object-cover" />

      {/* Ingredients */}
      <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
      <ul className="list-disc pl-6 mb-4">
        {recipe.ingredients?.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>

      {/* Cooking Instructions */}
      <h3 className="text-xl font-semibold mb-2">Instructions</h3>
      <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetail;
