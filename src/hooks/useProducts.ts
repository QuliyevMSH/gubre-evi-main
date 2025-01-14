import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // First, check if there are any basket entries for this product
      const { data: basketEntries, error: basketCheckError } = await supabase
        .from("basket")
        .select("id")
        .eq("product_id", id);

      if (basketCheckError) {
        console.error("Error checking basket entries:", basketCheckError);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Səbət yoxlanılarkən xəta baş verdi",
        });
        return;
      }

      // If there are basket entries, delete them first
      if (basketEntries && basketEntries.length > 0) {
        const { error: basketDeleteError } = await supabase
          .from("basket")
          .delete()
          .eq("product_id", id);

        if (basketDeleteError) {
          console.error("Error deleting basket entries:", basketDeleteError);
          toast({
            variant: "destructive",
            title: "Xəta",
            description: "Səbətdən məhsul silinmədi",
          });
          return;
        }
      }

      // Now we can safely delete the product
      const { error: productDeleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (productDeleteError) {
        console.error("Error deleting product:", productDeleteError);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Məhsul silinmədi",
        });
        return;
      }

      toast({
        title: "Uğurlu",
        description: "Məhsul silindi",
      });

      setProducts(prev => prev.filter(product => product.id !== id));
      setFilteredProducts(prev => prev.filter(product => product.id !== id));
    } catch (error: any) {
      console.error("Error in delete operation:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Məhsul silinmədi",
      });
    }
  };

  return {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    handleDeleteProduct,
    fetchProducts,
  };
};