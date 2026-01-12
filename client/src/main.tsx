import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import App from "./App";
import {
  Home,
  Login,
  AdminDashboard,
  UserDashboard,
  Signup,
  AdminPanel,
  CheckReservation,
  Checkout,
  BookRoom,
  RoomListing,
  FoundReservation,
} from "./pages/index";

import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Import your configured Redux store

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
      },
      {
        path: "/check-reservation",
        element: <CheckReservation />,
      },
      {
        path: "/bookroom",
        element: <BookRoom />,
      },
      {
        path: "/roomlisting",
        element: <RoomListing />,
      },
      {
        path: "/checkout/:roomId",
        element: <Checkout />,
      },
      {
        path: "/found-reservation",
        element: <FoundReservation />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
