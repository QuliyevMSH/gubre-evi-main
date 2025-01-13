import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

interface MainNavProps {
  isAdmin: boolean;
  className?: string;
}

export const MainNav = ({ isAdmin, className = "" }: MainNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleProductsClick = (e: React.MouseEvent) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate('/', { state: { scrollTo: 'products-section' } });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate('/', { state: { scrollTo: 'footer' } });
    }
  };

  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      <RouterLink to="/" className="nav-link">
        Ana Səhifə
      </RouterLink>
      
      {isHomePage ? (
        <ScrollLink
          to="products-section"
          smooth={true}
          duration={500}
          className="nav-link cursor-pointer"
          onClick={handleProductsClick}
        >
          Məhsullar
        </ScrollLink>
      ) : (
        <RouterLink to="/" className="nav-link" onClick={handleProductsClick}>
          Məhsullar
        </RouterLink>
      )}
      
      <RouterLink to="/about" className="nav-link">
        Haqqımızda
      </RouterLink>
      
      {isHomePage ? (
        <ScrollLink
          to="footer"
          smooth={true}
          duration={500}
          className="nav-link cursor-pointer"
          onClick={handleContactClick}
        >
          Əlaqə
        </ScrollLink>
      ) : (
        <RouterLink to="/" className="nav-link" onClick={handleContactClick}>
          Əlaqə
        </RouterLink>
      )}
      
      {isAdmin && (
        <RouterLink to="/admin" className="nav-link">
          Admin Panel
        </RouterLink>
      )}
    </nav>
  );
};