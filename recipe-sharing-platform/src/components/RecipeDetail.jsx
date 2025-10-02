import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch("/src/data.json")
      .then((res) => res.json())
      .then((data) => {
        const selectedRecipe = data.find((r) => r.id === parseInt(id));
        setRecipe(selectedRecipe);
      })
      .catch((err) => console.error("Error loading recipe:", err));
  }, [id]);

  if (!recipe) {
    return <p className="text-center text-gray-600">Loading recipe...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
      />
      <p className="text-gray-700 mb-6">{recipe.summary}</p>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Ingredient 1</li>
          <li>Ingredient 2</li>
          <li>Ingredient 3</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Instructions</h2>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Step 1: Prepare the ingredients.</li>
          <li>Step 2: Cook the dish following the steps.</li>
          <li>Step 3: Serve and enjoy!</li>
        </ol>
      </div>

      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default RecipeDetail;
