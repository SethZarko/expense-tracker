import { NavLink } from "react-router-dom";

import Logo from "../assets/logo1.svg";

export const Header = () => {
  return (
    <>
      <header>
        <div className="custom-shape-divider-top-1733773339">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 0L0 0 598.97 114.72 1200 0z"
              className="shape-fill"
            ></path>
          </svg>
        </div>

        <div className="header-container">
          <NavLink to='/'>
            <h1 className="logo-text">
              Expense<span className="logo-span">Sense</span>
            </h1>
          </NavLink>
          
          <NavLink to='/'>
            <img className="logo-image" src={Logo} alt="logo-image" />
          </NavLink>
        </div>
      </header>
    </>
  );
};
