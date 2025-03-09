import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ background: '#f2f2f2', padding: '10px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>
        Home
      </Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}

export default NavBar;
