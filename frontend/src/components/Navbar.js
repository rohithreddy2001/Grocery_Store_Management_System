import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import headerLogo from '../images/header_logo.jpg';

function Navbar({handleLogout}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header content rows-content-header">
      <button className="button-menu-mobile show-sidebar" onClick={toggleMenu}>
        <i className="fa fa-bars"></i>
      </button>
      <div className="navbar navbar-default" role="navigation">
        <div className="container">
          <div className="navbar-collapse collapse">
            <ul className={`nav navbar-nav ${isMenuOpen ? 'active' : ''}`}>
              <div className="grocery-store-navbar">
                <img src={headerLogo} alt="Grocery Store Icon" className="grocery-store-icon" />
                <h2 className="grocery-store-title">Grocery Store Management System</h2>
                <ul className="breadcrumb">
                  <li>
                    <Link to="/">
                      <i className="zmdi zmdi-shopping-cart zmdi-hc-fw" style={{ fontSize: 32 }} title="Orders"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage-product">
                      <i className="zmdi zmdi-case zmdi-hc-fw" style={{ fontSize: 32 }} title="Products"></i>
                    </Link>
                  </li>
                  <li>
                  <i className="zmdi zmdi-power zmdi-hc-fw" style={{ color: 'red', cursor: 'Pointer', fontSize: '32px' }} title="Logout" onClick={handleLogout}></i>
                  </li>
                </ul>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;