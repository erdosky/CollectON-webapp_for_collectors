import { useState } from "react";
import "./css/Navbar.css";

export default function NavbarForNotLoggedUser() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

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
            <a href="/about">
              <span>
                {" "}
                <i class="fa fa-fw fa-search"></i>About site
              </span>
            </a>
          </li>
          <li>
            <a href="/login">
              {" "}
              <span>
                <i class="fa fa-fw fa-user"></i>Login
              </span>
            </a>
          </li>
          <li>
            <a href="/register">
              {" "}
              <span>
                {" "}
                <i class="fa fa-fw fa-address-card"></i>Register
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
