import { useEffect, useRef } from 'react';
import { ProductCard } from '@/components/ProductCard';

const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "NPK Gübrəsi",
    price: 45.99,
    description: "Universal NPK gübrəsi (15-15-15)",
    image: "/placeholder.svg",
    category: "mineral"
  },
  // ... add more demo products
];

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="min-h-screen">
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
            {DEMO_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;