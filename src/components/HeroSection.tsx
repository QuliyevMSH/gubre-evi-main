import { Link } from 'react-scroll';
import { Button } from './ui/button';

export const HeroSection = () => {
  return (
    <section 
      className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 relative"
      style={{
        backgroundImage: "url('/lovable-uploads/c0faf68e-dd54-416c-b19b-8b361ad336a6.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <img 
          src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png"
          alt="GübrəEvi Logo"
          className="w-32 h-32 animate-fade-in"
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-center animate-fade-in delay-100 text-white">
          Torpağa Gübrə, Məhsula Can!
        </h1>
        
        <div className="flex gap-4 animate-fade-in delay-200">
          <Link
            to="products-section"
            smooth={true}
            duration={500}
            className="cursor-pointer"
          >
            <Button size="lg" variant="default">
              Məhsullar
            </Button>
          </Link>
          
          <Link
            to="footer"
            smooth={true}
            duration={500}
            className="cursor-pointer"
          >
            <Button size="lg" variant="default">
              Əlaqə
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};