import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

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

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const product = DEMO_PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Məhsul tapılmadı</div>;
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-medium text-primary">
              {formatPrice(product.price)}
            </p>
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            <div className="mt-8 flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-lg font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="mt-8"
              size="lg"
              onClick={handleAddToCart}
            >
              Səbətə əlavə et
            </Button>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Digər məhsullar</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PRODUCTS.filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;