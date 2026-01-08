import { Outlet } from "react-router-dom";
import Navbar from "./components/global/navbar/NavBar";
import "./App.css";

function App() {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
