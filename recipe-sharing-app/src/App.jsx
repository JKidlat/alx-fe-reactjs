import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// ----------------------------------------------------
// Step 1: Define the Zustand Store
// This store manages all application state, including recipes,
// search terms, favorites, and recommendations.
// ----------------------------------------------------
const useRecipeStore = create((set, get) => ({
  recipes: [
    { id: '1', title: 'Spicy Peanut Noodles', description: 'A quick and flavorful noodle dish with a spicy peanut sauce.', ingredients: 'Noodles, Peanut Butter, Soy Sauce, Chili Flakes', prepTime: 15 },
    { id: '2', title: 'Classic Chocolate Chip Cookies', description: 'The perfect, chewy chocolate chip cookies.', ingredients: 'Flour, Sugar, Butter, Eggs, Chocolate Chips', prepTime: 25 },
    { id: '3', title: 'Hearty Lentil Soup', description: 'A warm and comforting soup filled with vegetables and lentils.', ingredients: 'Lentils, Carrots, Celery, Onions, Vegetable Broth', prepTime: 40 },
    { id: '4', title: 'Lemon Herb Roasted Chicken', description: 'Juicy roasted chicken with lemon and fresh herbs.', ingredients: 'Chicken, Lemon, Rosemary, Thyme, Olive Oil', prepTime: 60 },
  ],
  favorites: [],
  searchTerm: '',
  recommendations: [],

  // Recipe management actions
  addRecipe: (newRecipe) => set((state) => ({ recipes: [...state.recipes, newRecipe] })),
  deleteRecipe: (recipeId) => set((state) => ({
    recipes: state.recipes.filter(recipe => recipe.id !== recipeId),
    favorites: state.favorites.filter(id => id !== recipeId),
  })),
  updateRecipe: (updatedRecipe) => set((state) => ({
    recipes: state.recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    ),
  })),

  // Search and filter actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Favorites actions
  addFavorite: (recipeId) => set((state) => ({
    favorites: [...new Set([...state.favorites, recipeId])]
  })),
  removeFavorite: (recipeId) => set((state) => ({
    favorites: state.favorites.filter(id => id !== recipeId)
  })),

  // Recommendation actions
  generateRecommendations: () => {
    const allRecipes = get().recipes;
    const favoriteIds = get().favorites;
    const recommendations = allRecipes.filter(recipe => !favoriteIds.includes(recipe.id));
    set({ recommendations });
  },
}));

// ----------------------------------------------------
// Step 2 & 3: All React Components
// All components are defined here, using the Zustand store
// and React Router hooks as needed.
// ----------------------------------------------------

const Header = () => (
  <header className="bg-white shadow-sm py-4 mb-8">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tight">
        Recipe Sharing App
      </Link>
      <nav className="flex space-x-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        <Link to="/add" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
          Add Recipe
        </Link>
      </nav>
    </div>
  </header>
);

const SearchBar = () => {
  const setSearchTerm = useRecipeStore(state => state.setSearchTerm);
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search recipes..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
        <Link to={`/recipe/${recipe.id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
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
  const { recipes, searchTerm } = useRecipeStore(state => ({
    recipes: state.recipes,
    searchTerm: state.searchTerm,
  }));

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">No recipes found matching your search.</p>
      )}
    </div>
  );
};

const AddRecipeForm = () => {
  const addRecipe = useRecipeStore(state => state.addRecipe);
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
  const updateRecipe = useRecipeStore(state => state.updateRecipe);
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRecipe({ ...recipe, title, description, ingredients, prepTime: parseInt(prepTime) || 0 });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
      />
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={prepTime}
        onChange={(e) => setPrepTime(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const DeleteRecipeButton = ({ recipeId }) => {
  const deleteRecipe = useRecipeStore(state => state.deleteRecipe);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(recipeId);
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
    >
      Delete Recipe
    </button>
  );
};

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const recipe = useRecipeStore(state =>
    state.recipes.find(r => r.id === recipeId)
  );

  if (!recipe) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <p className="text-xl text-red-500">Recipe not found!</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Go back to home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {isEditing ? (
        <EditRecipeForm recipe={recipe} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-6">{recipe.description}</p>
          <div className="space-y-4 text-gray-700">
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
          </div>
          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Recipe
            </button>
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
        </>
      )}
    </div>
  );
};

const FavoritesList = () => {
  const { recipes, favorites } = useRecipeStore();
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Favorites </h2>
      {favoriteRecipes.length > 0 ? (
        <div className="space-y-4">
          {favoriteRecipes.map(recipe => (
            <div key={recipe.id} className="p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-blue-50">
              <Link to={`/recipe/${recipe.id}`} className="block text-lg font-semibold text-gray-800 hover:text-blue-600">
                {recipe.title}
              </Link>
              <p className="text-sm text-gray-600 truncate">{recipe.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">You haven't added any favorites yet.</p>
      )}
    </div>
  );
};

const RecommendationsList = () => {
  const { recommendations, generateRecommendations } = useRecipeStore();
  const favorites = useRecipeStore(state => state.favorites);
  
  // Re-generate recommendations whenever favorites change
  useEffect(() => {
    generateRecommendations();
  }, [favorites, generateRecommendations]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">You Might Like </h2>
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map(recipe => (
            <div key={recipe.id} className="p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-blue-50">
              <Link to={`/recipe/${recipe.id}`} className="block text-lg font-semibold text-gray-800 hover:text-blue-600">
                {recipe.title}
              </Link>
              <p className="text-sm text-gray-600 truncate">{recipe.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Add some favorites to get recommendations!</p>
      )}
    </div>
  );
};

const HomePage = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <SearchBar />
      <RecipeList />
    </div>
    <div className="space-y-6">
      <FavoritesList />
      <RecommendationsList />
    </div>
  </div>
);

// ----------------------------------------------------
// Step 4: Integrate all components in the main App
// This sets up the routing for the application.
// ----------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <Header />
        <main className="container mx-auto px-4 pb-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
            <Route path="/add" element={<AddRecipeForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
