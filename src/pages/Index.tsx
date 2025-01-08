import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import Header from '@/components/Header'; // Changed to default import
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, description, image, category');

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          variant: "destructive",
          title: "Xəta baş verdi",
          description: "Məhsulları yükləyərkən xəta baş verdi",
        });
      }
    };

    fetchProducts();
  }, [toast]);

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative h-screen">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="container px-4">
            <h1 className="text-4xl font-bold text-white sm:text-6xl">
              GübrəEvi
            </h1>
            <p className="mt-4 text-lg text-white/90 sm:text-xl">
              Keyfiyyətli gübrələr, sağlam məhsullar
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold">Məhsullarımız</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;