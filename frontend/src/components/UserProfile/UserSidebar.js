import React from "react";
import { Link } from "react-router-dom";
import "./css/UserSidebar.css";
import "../authentication/css/Button.css";

export default function UserSidebar({ activepage }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location = "/home";
  };

  return (
    <div className="usersidebar">
      <nav className="sidebar-menu">
        <ul>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          <li className={activepage === "profile" ? "active" : ""}>
            <Link to="/user/profile">
              <span>
                {" "}
                <i className="fa fa-fw fa-user"></i> Profile
              </span>
            </Link>
          </li>
          <li className={activepage === "accountsettings" ? "active" : ""}>
            <Link to="/user/accountsettings">
              {" "}
              <span>
                <i className="fa fa-fw fa-cogs"> </i> Account Settings
              </span>
            </Link>
          </li>
          <li className={activepage === "mycollections" ? "active" : ""}>
            <Link to="/user/mycollections">
              <span>
                {" "}
                <i className="fa fa-fw fa-archive"></i> My Collections
              </span>
            </Link>
          </li>
          <li className={activepage === "auctions" ? "active" : ""}>
            <Link to="/user/offers">
              <span>
                {" "}
                <i className="fa fa-fw fa-cart-arrow-down"></i> Buy/Exchange Offfers
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
