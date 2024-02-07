import "./css/Navbar.css";
import { useState } from "react";

export default function NavbarForLoggedUser() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location = "/home";
  };

  return (
    <nav className="navigation">
      <h1 href="/" className="brand-name">
        CollectOn
      </h1>
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          <li>
            <a href="/home">
              <span>
                {" "}
                <i class="fa fa-fw fa-home"></i>Home
              </span>
            </a>
          </li>
          <li>
            <a href="/user/mycollections">
              <span>
                <i class="fa fa-fw fa-archive"></i>My collections
              </span>
            </a>
          </li>
          <li>
            <a href="/exploreCollections">
              <span>
                <i class="fa fa-fw fa-compass"></i>Explore collections
              </span>
            </a>
          </li>
          <li>
            <a href="/user/profile">
              <span>
                <i class="fa fa-fw fa-user"></i>Profile
              </span>
            </a>
          </li>
          <li>
            <button className="logout-navbar" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
