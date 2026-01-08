import { Outlet } from "react-router-dom";
import Navbar from "./components/global/navbar/NavBar";
import Footer from "./components/global/footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
