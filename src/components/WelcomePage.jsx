import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-container">
      {/* Фоновое видео */}
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/fon_lin.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      
      {/* Контент поверх видео */}
      <div className="welcome-content">
        <h1 className="welcome-title">Ласкаво просимо до OptiProfil</h1>
        <p className="welcome-subtitle">Платформа для обробки спектральних характеристик тонкоплівкових шарів.</p>
        <Link to="/upload" className="welcome-button">
          Перейти до завантаження файлів
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
