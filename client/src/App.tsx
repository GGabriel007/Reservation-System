import { Outlet } from "react-router-dom";
import Navbar from "./components/global/navbar/NavBar";
import Footer from "./components/global/footer/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
