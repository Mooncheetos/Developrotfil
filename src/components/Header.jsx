import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Головна</Link>
        <span className="nav-divider">|</span>
        <Link to="/upload" className="nav-link">Графік хвилі й розрахунок товщини</Link>
        <span className="nav-divider">|</span>        
        <Link to="/bandgap" className="nav-link">Ширина забороненої зони</Link>
        <span className="nav-divider">|</span>
        {/* <Link to="/refractive-index" className="nav-link">Коэффициент преломления</Link> */}
      </nav>
    </header>
  );
}

export default Header;
