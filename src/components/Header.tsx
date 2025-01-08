import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { CartSheet } from "./CartSheet"; // Changed to named import

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Gübrə Evi
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <input
              type="text"
              placeholder="Axtar..."
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <CartSheet />
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost">Giriş</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
