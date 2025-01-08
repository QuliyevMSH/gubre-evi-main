import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { CartSheet } from './CartSheet';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            GübrəEvi
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Ana Səhifə
            </Link>
            <Link to="/products" className="nav-link">
              Məhsullar
            </Link>
            <Link to="/about" className="nav-link">
              Haqqımızda
            </Link>
            <Link to="/contact" className="nav-link">
              Əlaqə
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <CartSheet />
            </Sheet>

            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="default" onClick={handleSignOut}>
                  Çıxış
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default">Giriş / Qeydiyyat</Button>
              </Link>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ana Səhifə
                  </Link>
                  <Link
                    to="/products"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Məhsullar
                  </Link>
                  <Link
                    to="/about"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Haqqımızda
                  </Link>
                  <Link
                    to="/contact"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Əlaqə
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};