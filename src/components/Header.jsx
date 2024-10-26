import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Головна</Link>
        <span className="nav-divider">|</span>
        <Link to="/upload" className="nav-link">Графік</Link>
      </nav>
    </header>
  );
}

export default Header;
