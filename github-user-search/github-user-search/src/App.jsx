import Search from "./components/Search";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">GitHub User Search</h1>
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>

      <Search />
    </div>
  );
}

export default App;
