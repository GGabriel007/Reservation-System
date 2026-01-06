import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Home, Login, AdminDashboard, UserDashboard, Signup, AdminPanel } from "./pages/index";

/**
 * Defines the application's route structure.
 * We nest everything under "/" with <App /> as the element 
 * so the Navbar is always visible.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup", //  
        element: <Signup />,
      },
      {
        path: "/user",
        element: <UserDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/adminPanel",
        element: <AdminPanel />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);