import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Ласкаво просимо до OptiProfil</h1>
      <p className="welcome-subtitle">Платформа для обробки спектральних характеристик тонкоплівкових шарів.</p>
      <Link to="/upload" className="welcome-button">
        Перейти до завантаження файлів
      </Link>
    </div>
  );
}

export default WelcomePage;
