import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Головна</Link>
        <span className="nav-divider">|</span>
        <Link to="/upload" className="nav-link">Графік</Link>
        <span className="nav-divider">|</span>
        <Link to="/thickness" className="nav-link">Розрахунок товщини</Link>
        <span className="nav-divider">|</span>
        <Link to="/bandgap" className="nav-link">Ширина забороненої зони</Link> {/* Новая кнопка для 4й страницы */}
      </nav>
    </header>
  );
}

export default Header;
