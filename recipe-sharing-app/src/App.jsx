import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =============================================================================
// State Management (Zustand Store)
// All application state is managed here. It persists to localStorage.
// =============================================================================

const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [
        {
          id: '1',
          title: 'Classic Tomato Pasta',
          description: 'A simple and delicious pasta dish with a homemade tomato sauce.',
          ingredients: 'Pasta, Tomatoes, Onion, Garlic, Olive Oil, Basil, Salt, Pepper',
          prepTime: 30,
        },
        {
          id: '2',
          title: 'Spicy Chicken Tacos',
          description: 'Quick and easy tacos with seasoned chicken and fresh toppings.',
          ingredients: 'Chicken, Taco Shells, Lettuce, Tomato, Cheese, Sour Cream, Chili Powder',
          prepTime: 20,
        },
        {
          id: '3',
          title: 'Vegetable Stir-Fry',
          description: 'Healthy and colorful stir-fry with your favorite vegetables.',
          ingredients: 'Broccoli, Bell Peppers, Carrots, Soy Sauce, Ginger, Garlic, Sesame Oil',
          prepTime: 25,
        },
      ],
      favorites: [],
      searchTerm: '',
      recommendations: [],

      addRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes, recipe] })),
      updateRecipe: (updatedRecipe) =>
        set((state) => ({
          recipes: state.recipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)),
        })),
      deleteRecipe: (id) =>
        set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== id) })),
      addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
      removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((favId) => favId !== id) })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      generateRecommendations: () => {
        const recipes = get().recipes;
        const recommendations = recipes
          .slice()
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        set({ recommendations });
      },
    }),
    {
      name: 'recipe-app-storage',
    }
  )
);

// =============================================================================
// Components
// The individual components for the application are defined below.
// =============================================================================

const SearchBar = () => {
  const setSearchTerm = useRecipeStore((state) => state.setSearchTerm);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search recipes..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
      />
    </div>
  );
};

const RecipeCard = ({ recipe }) => {
  const { favorites, addFavorite, removeFavorite } = useRecipeStore();
  const isFavorite = favorites.includes(recipe.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    isFavorite ? removeFavorite(recipe.id) : addFavorite(recipe.id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-transform duration-200 hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <Link
          to={`/recipe/${recipe.id}`}
          className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          {recipe.title}
        </Link>
        <button onClick={handleFavoriteClick} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
          <svg className={`h-6 w-6 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 8.309 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
      <p className="text-gray-600 text-sm">{recipe.description}</p>
    </div>
  );
};

const RecipeList = () => {
  const { recipes, searchTerm } = useRecipeStore((state) => ({
    recipes: state.recipes,
    searchTerm: state.searchTerm,
  }));

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
      ) : (
        <p className="text-gray-500 text-center col-span-full">No recipes found matching your search.</p>
      )}
    </div>
  );
};

const AddRecipeForm = () => {
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [prepTime, setPrepTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    const newRecipe = {
      id: crypto.randomUUID(),
      title,
      description,
      ingredients,
      prepTime: parseInt(prepTime) || 0,
    };
    addRecipe(newRecipe);
    navigate('/');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe Description"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
        />
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (comma separated)"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder="Preparation Time (in minutes)"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md transform hover:scale-105"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

const EditRecipeForm = ({ recipe, onCancel }) => {
  const updateRecipe = useRecipeStore((state) => state.updateRecipe);
  const navigate = useNavigate();

  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    updateRecipe({
      ...recipe,
      title,
      description,
      ingredients,
      prepTime: parseInt(prepTime) || 0,
    });
    onCancel();
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe Description"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
        />
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (comma separated)"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder="Preparation Time (in minutes)"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md transform hover:scale-105"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-6 rounded-lg text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const DeleteRecipeButton = ({ recipeId }) => {
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteRecipe(recipeId);
    navigate('/');
  };

  return (
    <button
      onClick={handleDelete}
      className="py-2 px-6 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200"
    >
      Delete Recipe
    </button>
  );
};

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = useRecipeStore((state) => state.recipes.find((r) => r.id === id));
  const [isEditing, setIsEditing] = useState(false);

  if (!recipe) {
    return <div className="text-center text-gray-500">Recipe not found.</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
      {isEditing ? (
        <EditRecipeForm recipe={recipe} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full mr-2">
              Prep Time: {recipe.prepTime} min
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
              Ingredients: {recipe.ingredients}
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-6 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Recipe
            </button>
            <DeleteRecipeButton recipeId={recipe.id} />
            <button
              onClick={() => navigate(-1)}
              className="py-2 px-6 rounded-lg text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const FavoritesList = () => {
  const { recipes, favorites } = useRecipeStore((state) => ({
    recipes: state.recipes,
    favorites: state.favorites,
  }));

  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Favorites</h2>
      {favoriteRecipes.length > 0 ? (
        <ul className="space-y-4">
          {favoriteRecipes.map((recipe) => (
            <li key={recipe.id} className="p-4 bg-gray-50 rounded-lg">
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {recipe.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{recipe.description.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">You don't have any favorite recipes yet.</p>
      )}
    </div>
  );
};

const RecommendationsList = () => {
  const { recommendations, generateRecommendations } = useRecipeStore((state) => ({
    recommendations: state.recommendations,
    generateRecommendations: state.generateRecommendations,
  }));

  // Generate recommendations on initial load
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul className="space-y-4">
          {recommendations.map((recipe) => (
            <li key={recipe.id} className="p-4 bg-gray-50 rounded-lg">
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {recipe.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{recipe.description.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No recommendations available. Try adding some favorites first!</p>
      )}
    </div>
  );
};

// =============================================================================
// Main App Component & Routing
// This component ties everything together with React Router.
// =============================================================================

const HomePage = () => (
  <>
    <div className="mb-8">
      <SearchBar />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Recipes</h2>
        <RecipeList />
      </div>
      <div className="space-y-6">
        <RecommendationsList />
        <FavoritesList />
      </div>
    </div>
  </>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link to="/" className="text-2xl font-extrabold text-blue-600">
              Recipe Vault
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-semibold">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/add" className="py-2 px-4 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200">
                    Add Recipe
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddRecipeForm />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route
              path="*"
              element={
                <div className="text-center p-8">
                  <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
                  <p className="text-lg text-gray-600 mt-4">The page you are looking for does not exist.</p>
                  <Link to="/" className="mt-6 inline-block py-2 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                    Go to Homepage
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
