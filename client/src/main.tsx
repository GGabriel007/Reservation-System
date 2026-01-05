import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Home, Login, AdminDashboard, UserDashboard } from "./pages/index";

/**
 * Defines the application's route structure using React Router v6+.
 *
 * Routes:
 * - "/" → Main layout (App) with MainPage.
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
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/user",
    element: <App />,
    children: [
      {
        path: "/user",
        element: <UserDashboard />,
      },
    ],
  },
  {
    path: "/admin",
    element: <App />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
    ],
  },
]);

/**
 * Entry point for the React application.
 * Sets up the router configuration and renders the root React component.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
