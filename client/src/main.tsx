import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import AuthPersist from "./components/auth/AuthPersist";
import App from "./App";
import {
  Home,
  Login,
  UserDashboard,
  Signup,
  AdminPanel,
  CheckReservation,
  Checkout,
  BookRoom,
  RoomListing,
  FoundReservation,
  HotelListing,
  StaffLogin,
  ErrorPage,
} from "./pages/index";

import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Import your configured Redux store
import ThankYou from "./pages/thankYou/ThankYou";

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
        element: <AuthPersist />,
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
            path: "/adminPanel",
            element: <AdminPanel />,
          },
          {
            path: "/checkreservation",
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
            path: "/hotellisting",
            element: <HotelListing />,
          },
          {
            path: "/roomlisting/checkout",
            element: <Checkout />,
          },
          {
            path: "/foundreservation",
            element: <FoundReservation />,
          },
          {
            path: "/staffLogin",
            element: <StaffLogin />,
          },
          {
            path: "/thankyou",
            element: <ThankYou />,
          },
          {
            path: "*",
            element: <ErrorPage />,
          },
        ],
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
