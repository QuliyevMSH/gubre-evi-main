import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

export const MobileNav = ({ isOpen, onOpenChange, isAdmin }: MobileNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleProductsClick = (e: React.MouseEvent) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate('/', { state: { scrollTo: 'products-section' } });
    }
    onOpenChange(false);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate('/', { state: { scrollTo: 'footer' } });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <RouterLink
            to="/"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
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
            <RouterLink 
              to="/" 
              className="nav-link"
              onClick={handleProductsClick}
            >
              Məhsullar
            </RouterLink>
          )}
          
          <RouterLink
            to="/about"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
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
            <RouterLink 
              to="/" 
              className="nav-link"
              onClick={handleContactClick}
            >
              Əlaqə
            </RouterLink>
          )}
          
          {isAdmin && (
            <RouterLink
              to="/admin"
              className="nav-link"
              onClick={() => onOpenChange(false)}
            >
              Admin Panel
            </RouterLink>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};