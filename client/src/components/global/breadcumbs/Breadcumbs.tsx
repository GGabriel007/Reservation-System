// components/Breadcrumbs.tsx
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();

  const nameList = {
    roomlisting: "Select A Room",
    login: "Log In",
    signup: "Sign Up",
    user: "Profile",
    adminPanel: "Admin Dashboard",
    checkreservation: "Check Your Reservation",
    bookroom: "Your Rooms",
    hotellisting: "Select A Hotel",
    checkout: "Check Out",
    foundreservation: "Your Reservation",
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div aria-label="breadcrumb" style={{ margin: "16px 0" }}>
      <ol style={{ display: "flex", listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/">Home</Link>
          {pathnames.length > 0 && <span>&nbsp;/&nbsp;</span>}
        </li>
        {pathnames.map((name, index) => {
          // Build the route up to this breadcrumb
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Replace dynamic params with actual values
          let displayName = (nameList as any)[name];
          if (params && params.id && name === params.id) {
            displayName = `Product ${params.id}`;
          }

          return (
            <li key={routeTo}>
              {isLast ? (
                <span>{displayName}</span>
              ) : (
                <>
                  <Link to={routeTo}>{displayName}</Link> /&nbsp;
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Breadcrumbs;
