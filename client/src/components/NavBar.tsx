import { NavLink } from "react-router-dom";

/**
 * Navigation bar for the Reservation System Website
 * @returns {TSX.Element} Navbar component
 */
export default function Navbar() {
  return (
    <div>
      <nav className="flex">
        <NavLink to="/">
          <p>Liore</p>
        </NavLink>
        <NavLink to="/login">
          <p>Login</p>
        </NavLink>
        <NavLink to="/logout">
          <p>Logout</p>
        </NavLink>
        <NavLink to="/singup">
          <p>Sign Up</p>
        </NavLink>
        <NavLink to="/user">
          <p>User</p>
        </NavLink>
        <NavLink to="/admin">
          <p>Admin</p>
        </NavLink>
      </nav>
    </div>
  );
}
