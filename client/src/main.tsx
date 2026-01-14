import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import AuthPersist from "./components/auth/AuthPersist";
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
  HotelListing,
  StaffLogin,
} from "./pages/index";

import { Provider } from "react-redux";
import { store } from "@/redux/store"; 

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
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/staffLogin",
        element: <StaffLogin />,
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
        path: "/hotellisting",
        element: <HotelListing />,
      },
      {
        path: "/checkout/:roomId",
        element: <Checkout />,
      },
      {
        path: "/found-reservation",
        element: <FoundReservation />,
      },

      {
        element: <AuthPersist />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "/adminPanel",
            element: <AdminPanel />,
          },
          {
            path: "/user",
            element: <UserDashboard />,
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