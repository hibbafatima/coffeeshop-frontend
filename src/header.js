import React from 'react';

function Header({ activePage }) {
  return (
    <header className="bg-dark p-3 sticky-top">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="nav-item nav-link d-flex align-items-center" href="#" style={{ fontSize: '30px', fontWeight: 'bold'}}>CS</a>
        <nav className='justify-content-end'>
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">Menu</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">Promotions</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">History</a>
            </li>
          </ul>
        </nav>
        <div>
          <a className="nav-link">Cart</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
