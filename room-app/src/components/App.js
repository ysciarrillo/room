import "./App.css";
import Room from "./Room";
import Home from "./Home";
import { Routes, Route } from "react-router-dom";
import useLocalStorage from "use-local-storage"

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  return (
    <div className="App" data-theme={theme}>
      <header>
        <h1>chatterbox</h1>
        <button onClick={switchTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>

  );
}

export default App;
