import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useLocation } from 'react-router-dom';

interface MainNavProps {
  isAdmin: boolean;
  className?: string;
}

export const MainNav = ({ isAdmin, className = "" }: MainNavProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
        >
          Məhsullar
        </ScrollLink>
      ) : (
        <RouterLink to="/products" className="nav-link">
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
        >
          Əlaqə
        </ScrollLink>
      ) : (
        <RouterLink to="/contact" className="nav-link">
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