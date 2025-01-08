import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface BasketItem {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export const CartSheet = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBasketItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBasketItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('basket')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setBasketItems(data || []);
    } catch (error) {
      console.error('Error fetching basket items:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Səbət məlumatları yüklənmədi",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasketItems();

    // Subscribe to changes in the basket table
    const channel = supabase
      .channel('basket_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'basket'
        },
        () => {
          fetchBasketItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity === 0) {
        await removeItem(itemId);
        return;
      }

      const { error } = await supabase
        .from('basket')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Miqdar yenilənmədi",
      });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const { error } = await supabase
        .from('basket')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul silinmədi",
      });
    }
  };

  const total = basketItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Səbət</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Səbət</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-6">
        {basketItems.length === 0 ? (
          <p className="text-center text-muted-foreground">Səbət boşdur</p>
        ) : (
          <ul className="divide-y">
            {basketItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    src={item.products?.image}
                    alt={item.products?.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium">
                      <h3>{item.products?.name}</h3>
                      <p className="ml-4">{formatPrice(item.products?.price || 0)}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {basketItems.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex justify-between text-base font-medium">
            <p>Cəmi</p>
            <p>{formatPrice(total)}</p>
          </div>
          <Button className="mt-6 w-full">Sifarişi tamamla</Button>
        </div>
      )}
    </SheetContent>
  );
};